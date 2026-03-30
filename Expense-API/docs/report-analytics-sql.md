# Report Analytics SQL Logic

This document captures the SQL logic behind the report analytics used by the `/v1/reports/me` and `/v1/reports/team` endpoints.

## Parameters

All queries assume the following bound parameters:

- `:current_user_id`
- `:start_of_month`
- `:start_of_next_month`

The active month window is:

```sql
expense.bill_date >= :start_of_month
AND expense.bill_date < :start_of_next_month
```

## User View

### 1. Total claims

```sql
SELECT
  COUNT(ue.id) AS total_claim_count,
  COALESCE(SUM(ue.amount), 0) AS total_claim_amount
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.submitted_at IS NOT NULL
  AND ue.status IN ('APPROVED', 'PENDING', 'REJECTED')
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month;
```

### 2. In approval stage

```sql
SELECT
  COUNT(ue.id) AS pending_count,
  COALESCE(SUM(ue.amount), 0) AS pending_amount
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.status = 'PENDING'
  AND ue.submitted_at IS NOT NULL
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month;
```

### 3. Rejected claims

```sql
SELECT
  COUNT(ue.id) AS rejected_count,
  COALESCE(SUM(ue.amount), 0) AS rejected_amount
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.status = 'REJECTED'
  AND ue.submitted_at IS NOT NULL
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month;
```

### 4. Paid status

The current report source tables do not persist a separate payment-processed state,
so this metric is mapped to approved/reimbursed claims in `user_expenses.status`.

```sql
SELECT
  COUNT(ue.id) AS approved_count,
  COALESCE(SUM(ue.amount), 0) AS approved_reimbursement_total
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.status = 'APPROVED'
  AND ue.submitted_at IS NOT NULL
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month;
```

### 5. Daily expense activity trend

```sql
SELECT
  e.bill_date AS day,
  COALESCE(
    SUM(CASE WHEN ue.status = 'APPROVED' THEN ue.amount ELSE 0 END),
    0
  ) AS approved_amount,
  COALESCE(
    SUM(CASE WHEN ue.status = 'PENDING' THEN ue.amount ELSE 0 END),
    0
  ) AS pending_amount
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.status IN ('APPROVED', 'PENDING')
  AND e.bill_date IS NOT NULL
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month
GROUP BY e.bill_date
ORDER BY e.bill_date;
```

The API then zero-fills each day in the selected month and computes:

```sql
cumulative_amount(day_n) =
  SUM(approved_amount + pending_amount) from month start through day_n
```

### 5. Category breakdown

```sql
SELECT
  e.category,
  COUNT(ue.id) AS count
FROM user_expenses ue
JOIN expenses e
  ON e.id = ue.expense_id
WHERE ue.user_id = :current_user_id
  AND ue.status = 'APPROVED'
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month
GROUP BY e.category;
```

## Manager View

### 1. Team spend, pending amount, employee waiting count, queue aging, and rejection rate inputs

```sql
SELECT
  COUNT(CASE WHEN uea.status = 'PENDING' THEN 1 END)
    AS pending_approvals_count,
  COALESCE(
    SUM(CASE WHEN uea.status = 'APPROVED' THEN ue.amount ELSE 0 END),
    0
  ) AS total_spent,
  COALESCE(
    SUM(CASE WHEN uea.status = 'PENDING' THEN ue.amount ELSE 0 END),
    0
  ) AS pending_amount,
  COUNT(
    DISTINCT CASE WHEN uea.status = 'PENDING' THEN ue.user_id END
  ) AS pending_employee_count,
  COALESCE(
    AVG(
      CASE
        WHEN uea.status = 'PENDING'
        THEN EXTRACT(EPOCH FROM (NOW() - ue.submitted_at)) / 86400.0
      END
    ),
    0
  ) AS average_queue_age_days,
  COALESCE(
    MAX(
      CASE
        WHEN uea.status = 'PENDING'
        THEN EXTRACT(EPOCH FROM (NOW() - ue.submitted_at)) / 86400.0
      END
    ),
    0
  ) AS oldest_queue_age_days,
  COUNT(CASE WHEN uea.status = 'REJECTED' THEN 1 END)
    AS rejected_count,
  COUNT(CASE WHEN uea.status IN ('APPROVED', 'REJECTED') THEN 1 END)
    AS decided_count
FROM user_expense_approvals uea
JOIN user_expenses ue
  ON ue.id = uea.user_expense_id
JOIN expenses e
  ON e.id = ue.expense_id
WHERE uea.approver_id = :current_user_id
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month;
```

Rejection rate is then computed as:

```sql
rejection_rate = rejected_count / decided_count * 100
```

### 2. Pending amount by employee

```sql
SELECT
  u.id AS user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  COUNT(uea.id) AS pending_count,
  COALESCE(SUM(ue.amount), 0) AS pending_amount
FROM user_expense_approvals uea
JOIN user_expenses ue
  ON ue.id = uea.user_expense_id
JOIN expenses e
  ON e.id = ue.expense_id
JOIN users u
  ON u.id = ue.user_id
WHERE uea.approver_id = :current_user_id
  AND uea.status = 'PENDING'
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month
GROUP BY u.id, u.first_name, u.last_name
ORDER BY pending_amount DESC, pending_count DESC, u.id ASC
LIMIT 5;
```

### 3. Top spenders

```sql
SELECT
  u.id AS user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  COUNT(ue.id) AS expense_count,
  COALESCE(SUM(ue.amount), 0) AS total_amount
FROM user_expense_approvals uea
JOIN user_expenses ue
  ON ue.id = uea.user_expense_id
JOIN expenses e
  ON e.id = ue.expense_id
JOIN users u
  ON u.id = ue.user_id
WHERE uea.approver_id = :current_user_id
  AND uea.status = 'APPROVED'
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_amount DESC, u.id ASC
LIMIT 5;
```

### 4. Approval activity trend

Daily approved and rejected amounts are grouped by approval action date:

```sql
SELECT
  DATE(uea.updated_at) AS day,
  COALESCE(
    SUM(CASE WHEN uea.status = 'APPROVED' THEN ue.amount ELSE 0 END),
    0
  ) AS approved_amount,
  COALESCE(
    SUM(CASE WHEN uea.status = 'REJECTED' THEN ue.amount ELSE 0 END),
    0
  ) AS rejected_amount
FROM user_expense_approvals uea
JOIN user_expenses ue
  ON ue.id = uea.user_expense_id
WHERE uea.approver_id = :current_user_id
  AND uea.status IN ('APPROVED', 'REJECTED')
  AND uea.updated_at >= :start_of_month
  AND uea.updated_at < :start_of_next_month
GROUP BY DATE(uea.updated_at)
ORDER BY DATE(uea.updated_at);
```

Open pending queue count is an end-of-day snapshot. Conceptually:

```sql
SELECT COUNT(*)
FROM user_expense_approvals uea
WHERE uea.approver_id = :current_user_id
  AND uea.created_at <= :day_end
  AND (
    uea.status = 'PENDING'
    OR uea.updated_at > :day_end
  );
```

The API computes this day by day across the selected month, including approvals
created before the month if they were still open on month start.

### 5. Team category breakdown

```sql
SELECT
  e.category,
  COUNT(uea.id) AS count
FROM user_expense_approvals uea
JOIN user_expenses ue
  ON ue.id = uea.user_expense_id
JOIN expenses e
  ON e.id = ue.expense_id
WHERE uea.approver_id = :current_user_id
  AND uea.status = 'APPROVED'
  AND e.bill_date >= :start_of_month
  AND e.bill_date < :start_of_next_month
GROUP BY e.category;
```
