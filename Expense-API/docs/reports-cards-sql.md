# Reports Cards SQL

This document lists the SQL logic for the card metrics shown on the `/reports`
screen only. It is split by `My Reports` and `Team Reports` to match the UI.

Charts and table/list queries are intentionally excluded here.

## Parameters

All queries assume:

- `:current_user_id`
- `:start_of_month`
- `:start_of_next_month`

Month filter:

```sql
e.bill_date >= :start_of_month
AND e.bill_date < :start_of_next_month
```

## My Reports

The cards in [MyReports.tsx](/Users/admin/Documents/expense/Expense-Web/src/pages/private/Reports/components/MyReports.tsx) are:

- `Total claims`
- `In approval stage`
- `Rejected claims`
- `Paid status`

### 1. Total claims

Mapped fields:

- `Total claims` -> `total_claim_amount`
- `Total claims` secondary label `submitted claims` -> `total_claim_count`

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

Mapped fields:

- `In approval stage` -> `pending_amount`
- `In approval stage` secondary label `pending claims` -> `pending_count`

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

Mapped fields:

- `Rejected claims` -> `rejected_amount`
- `Rejected claims` secondary label `rejected claims` -> `rejected_count`

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

Mapped fields:

- `Paid status` -> `approved_reimbursement_total`
- `Paid status` secondary label `approved claims` -> `approved_count`

Note: the current report source tables do not persist a separate `Payment Processed`
state. This card is therefore mapped to the approved/reimbursed state available in
`user_expenses.status`.

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

## Team Reports

The cards in [TeamReports.tsx](/Users/admin/Documents/expense/Expense-Web/src/pages/private/Reports/components/TeamReports.tsx) are:

- `Team spend`
- `Pending Approvals`
- `Pending amount`
- `Avg queue age`
- `Employees waiting`
- `Rejection rate`

### 1. Team spend
### 2. Pending Approvals
### 3. Pending amount
### 4. Avg queue age
### 5. Employees waiting
### 6. Rejection rate

These six cards come from one manager aggregate query plus one application-side
formula for rejection rate.

Mapped fields:

- `Team spend` -> `total_spent`
- `Pending Approvals` -> `pending_approvals_count`
- `Pending amount` -> `pending_amount`
- `Avg queue age` -> `average_queue_age_days`
- `Employees waiting` -> `pending_employee_count`
- `Employees waiting` secondary label `oldest pending` -> `oldest_queue_age_days`
- `Rejection rate` -> `rejected_count / decided_count * 100`

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

Rejection rate formula:

```sql
rejection_rate = rejected_count / decided_count * 100
```
