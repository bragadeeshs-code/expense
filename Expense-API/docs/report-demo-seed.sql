BEGIN;

WITH seed_rows AS (
    SELECT *
    FROM (
        VALUES
            (
                'seed-report-user-approved-01.pdf',
                3,
                5,
                1,
                'TRAVEL',
                'AUTO_BIKE_TAXI',
                1200.00::numeric(12, 2),
                1100.00::numeric(12, 2),
                DATE '2026-03-03',
                TIMESTAMPTZ '2026-03-03 10:00:00+00',
                TIMESTAMPTZ '2026-03-04 15:00:00+00',
                'APPROVED',
                'APPROVED',
                'City Cabs',
                'RPT-DEMO-001'
            ),
            (
                'seed-report-user-approved-02.pdf',
                3,
                97,
                1,
                'HOTEL_ACCOMMODATION',
                'RECEIPT',
                5400.00::numeric(12, 2),
                5200.00::numeric(12, 2),
                DATE '2026-03-10',
                TIMESTAMPTZ '2026-03-10 09:30:00+00',
                TIMESTAMPTZ '2026-03-12 13:30:00+00',
                'APPROVED',
                'APPROVED',
                'Grand Stay',
                'RPT-DEMO-002'
            ),
            (
                'seed-report-user-approved-03.pdf',
                3,
                5,
                1,
                'MEALS_FOOD',
                'RECEIPT',
                780.00::numeric(12, 2),
                780.00::numeric(12, 2),
                DATE '2026-03-17',
                TIMESTAMPTZ '2026-03-17 08:45:00+00',
                TIMESTAMPTZ '2026-03-18 12:15:00+00',
                'APPROVED',
                'APPROVED',
                'Spice Route',
                'RPT-DEMO-003'
            ),
            (
                'seed-report-user-pending-01.pdf',
                3,
                5,
                1,
                'FUEL_GAS',
                'RECEIPT',
                1450.00::numeric(12, 2),
                1325.00::numeric(12, 2),
                DATE '2026-03-20',
                TIMESTAMPTZ '2026-03-20 10:00:00+00',
                NULL::timestamptz,
                'PENDING',
                'PENDING',
                'Fuel Hub',
                'RPT-DEMO-004'
            ),
            (
                'seed-report-user-pending-02.pdf',
                3,
                97,
                1,
                'STATIONERY',
                'GENERAL',
                320.00::numeric(12, 2),
                300.00::numeric(12, 2),
                DATE '2026-03-25',
                TIMESTAMPTZ '2026-03-25 11:30:00+00',
                NULL::timestamptz,
                'PENDING',
                'PENDING',
                'Office Mart',
                'RPT-DEMO-005'
            ),
            (
                'seed-report-team-approved-01.pdf',
                23,
                3,
                1,
                'TRAVEL',
                'AUTO_BIKE_TAXI',
                2100.00::numeric(12, 2),
                2000.00::numeric(12, 2),
                DATE '2026-03-04',
                TIMESTAMPTZ '2026-03-04 09:00:00+00',
                TIMESTAMPTZ '2026-03-06 10:00:00+00',
                'APPROVED',
                'APPROVED',
                'Metro Taxi',
                'RPT-DEMO-006'
            ),
            (
                'seed-report-team-approved-02.pdf',
                23,
                3,
                1,
                'MEALS_FOOD',
                'RECEIPT',
                650.00::numeric(12, 2),
                650.00::numeric(12, 2),
                DATE '2026-03-11',
                TIMESTAMPTZ '2026-03-11 13:00:00+00',
                TIMESTAMPTZ '2026-03-12 09:00:00+00',
                'APPROVED',
                'APPROVED',
                'Bistro One',
                'RPT-DEMO-007'
            ),
            (
                'seed-report-team-approved-03.pdf',
                5,
                3,
                2,
                'HOTEL_ACCOMMODATION',
                'INVOICE',
                7800.00::numeric(12, 2),
                7600.00::numeric(12, 2),
                DATE '2026-03-07',
                TIMESTAMPTZ '2026-03-07 16:00:00+00',
                TIMESTAMPTZ '2026-03-09 11:00:00+00',
                'APPROVED',
                'APPROVED',
                'Harbor Stay',
                'RPT-DEMO-008'
            ),
            (
                'seed-report-team-approved-04.pdf',
                97,
                3,
                1,
                'TRAVEL',
                'FLIGHT_RECEIPT',
                3100.00::numeric(12, 2),
                3000.00::numeric(12, 2),
                DATE '2026-03-16',
                TIMESTAMPTZ '2026-03-16 09:15:00+00',
                TIMESTAMPTZ '2026-03-18 15:00:00+00',
                'APPROVED',
                'APPROVED',
                'Air Sprint',
                'RPT-DEMO-009'
            ),
            (
                'seed-report-team-pending-01.pdf',
                97,
                3,
                2,
                'FUEL_GAS',
                'RECEIPT',
                980.00::numeric(12, 2),
                950.00::numeric(12, 2),
                DATE '2026-03-21',
                TIMESTAMPTZ '2026-03-21 10:00:00+00',
                NULL::timestamptz,
                'PENDING',
                'PENDING',
                'Fuel Hub',
                'RPT-DEMO-010'
            ),
            (
                'seed-report-team-pending-02.pdf',
                23,
                3,
                2,
                'TRAVEL',
                'FLIGHT_INVOICE',
                4200.00::numeric(12, 2),
                4000.00::numeric(12, 2),
                DATE '2026-03-22',
                TIMESTAMPTZ '2026-03-22 12:00:00+00',
                NULL::timestamptz,
                'PENDING',
                'PENDING',
                'Sky Connect',
                'RPT-DEMO-011'
            ),
            (
                'seed-report-team-pending-03.pdf',
                5,
                3,
                2,
                'STATIONERY',
                'GENERAL',
                560.00::numeric(12, 2),
                540.00::numeric(12, 2),
                DATE '2026-03-26',
                TIMESTAMPTZ '2026-03-26 15:00:00+00',
                NULL::timestamptz,
                'PENDING',
                'PENDING',
                'Office Mart',
                'RPT-DEMO-012'
            ),
            (
                'seed-report-team-rejected-01.pdf',
                97,
                3,
                1,
                'MEALS_FOOD',
                'RECEIPT',
                890.00::numeric(12, 2),
                850.00::numeric(12, 2),
                DATE '2026-03-09',
                TIMESTAMPTZ '2026-03-09 14:00:00+00',
                TIMESTAMPTZ '2026-03-11 16:00:00+00',
                'REJECTED',
                'REJECTED',
                'Cafe Corner',
                'RPT-DEMO-013'
            )
    ) AS t(
        expense_name,
        user_id,
        approver_id,
        approval_level,
        category,
        sub_category,
        total_amount,
        reimbursable_amount,
        bill_date,
        submitted_at,
        decided_at,
        user_expense_status,
        approval_status,
        vendor_name,
        document_no
    )
),
insert_expenses AS (
    INSERT INTO expenses (
        organization_id,
        connection_id,
        name,
        format,
        vendor_name,
        category,
        sub_category,
        total_amount,
        currency,
        bill_date,
        document_no,
        scope,
        created_at,
        updated_at,
        created_by
    )
    SELECT
        u.organization_id,
        NULL,
        s.expense_name,
        'pdf',
        s.vendor_name,
        s.category::categorytype,
        s.sub_category::subcategorytype,
        s.total_amount,
        'INR',
        s.bill_date,
        s.document_no,
        'report_demo_seed',
        s.submitted_at,
        COALESCE(s.decided_at, s.submitted_at + INTERVAL '1 hour'),
        s.user_id
    FROM seed_rows s
    JOIN users u
        ON u.id = s.user_id
    WHERE NOT EXISTS (
        SELECT 1
        FROM expenses e
        WHERE e.name = s.expense_name
    )
    RETURNING id, name
),
all_expenses AS (
    SELECT
        ie.id AS expense_id,
        s.*
    FROM seed_rows s
    JOIN insert_expenses ie
        ON ie.name = s.expense_name

    UNION ALL

    SELECT
        e.id AS expense_id,
        s.*
    FROM seed_rows s
    JOIN expenses e
        ON e.name = s.expense_name
    WHERE NOT EXISTS (
        SELECT 1
        FROM insert_expenses ie
        WHERE ie.name = s.expense_name
    )
),
insert_user_expenses AS (
    INSERT INTO user_expenses (
        user_id,
        expense_id,
        project_id,
        trip_id,
        status,
        amount,
        submitted_at,
        highest_approved_level,
        created_at,
        updated_at
    )
    SELECT
        s.user_id,
        s.expense_id,
        NULL,
        NULL,
        s.user_expense_status::expensestatus,
        s.reimbursable_amount,
        s.submitted_at,
        CASE
            WHEN s.user_expense_status = 'APPROVED' THEN s.approval_level
            ELSE NULL
        END,
        s.submitted_at,
        COALESCE(s.decided_at, s.submitted_at + INTERVAL '1 hour')
    FROM all_expenses s
    WHERE NOT EXISTS (
        SELECT 1
        FROM user_expenses ue
        WHERE ue.user_id = s.user_id
          AND ue.expense_id = s.expense_id
    )
    RETURNING id, user_id, expense_id
),
all_user_expenses AS (
    SELECT
        iue.id AS user_expense_id,
        s.*
    FROM all_expenses s
    JOIN insert_user_expenses iue
        ON iue.user_id = s.user_id
       AND iue.expense_id = s.expense_id

    UNION ALL

    SELECT
        ue.id AS user_expense_id,
        s.*
    FROM all_expenses s
    JOIN user_expenses ue
        ON ue.user_id = s.user_id
       AND ue.expense_id = s.expense_id
    WHERE NOT EXISTS (
        SELECT 1
        FROM insert_user_expenses iue
        WHERE iue.user_id = s.user_id
          AND iue.expense_id = s.expense_id
    )
),
insert_approvals AS (
    INSERT INTO user_expense_approvals (
        user_expense_id,
        approver_id,
        approval_level,
        status,
        created_at,
        updated_at
    )
    SELECT
        s.user_expense_id,
        s.approver_id,
        s.approval_level,
        s.approval_status::approvalstatus,
        s.submitted_at + INTERVAL '1 hour',
        COALESCE(s.decided_at, s.submitted_at + INTERVAL '1 hour')
    FROM all_user_expenses s
    WHERE NOT EXISTS (
        SELECT 1
        FROM user_expense_approvals uea
        WHERE uea.user_expense_id = s.user_expense_id
          AND uea.approver_id = s.approver_id
          AND uea.approval_level = s.approval_level
    )
    RETURNING id
)
SELECT
    (SELECT count(*) FROM insert_expenses) AS inserted_expenses,
    (SELECT count(*) FROM insert_user_expenses) AS inserted_user_expenses,
    (SELECT count(*) FROM insert_approvals) AS inserted_approvals,
    (SELECT count(*) FROM seed_rows) AS seed_rows;

COMMIT;
