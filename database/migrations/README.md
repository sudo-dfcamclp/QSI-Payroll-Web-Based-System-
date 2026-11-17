# Payroll database migrations (Approach 2)

This package contains one Laravel migration file per existing application/framework table, excluding the `migrations` table because Laravel creates and manages it itself.

## Included tables

- `cache`
- `cache_locks`
- `password_reset_tokens`
- `sessions`
- `users`
- `role`
- `client_master`
- `cutoff_config`
- `tax_config`
- `sss_config`
- `philhealth_config`
- `pagibig_config`
- `deduction_types`
- `client_payroll_config`
- `employee_master`
- `payroll_period`
- `user_roles`
- `employee_basic_rate`
- `employee_deductions`
- `employee_deduction_payments`
- `employee_payroll_settings`
- `employee_payroll`


## Important

- These are **create-schema migrations** intended for a new/empty MySQL database.
- Do not run these migrations against the existing payroll database: the tables already exist and `CREATE TABLE` will fail.
- Back up the database before any schema operation.
- The SQL preserves the column definitions, defaults, nullability, indexes, unique indexes, and the 19 foreign-key constraints present in the supplied metadata exports.
- Table engine, charset, and collation were not included in the supplied exports, so these are left to the target MySQL database defaults.
- `migrations` is omitted intentionally; Laravel's migration system manages that table.
- The migration files use MySQL-specific `CREATE TABLE` SQL and are intended for MySQL/MariaDB, not SQLite.

## Fresh database usage

Copy all PHP files into `database/migrations/` in the listed timestamp order, configure an empty MySQL database in `.env`, then run:

```bash
php artisan migrate
```

## Existing database usage

Do not run this package on the existing database. If you want Laravel to adopt the existing schema, use a separate baseline/history strategy rather than executing these `CREATE TABLE` migrations.
