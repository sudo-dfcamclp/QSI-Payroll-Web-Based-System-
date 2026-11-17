<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_deduction_payments table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_deduction_payments` (
  `id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `emp_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `deduction_type_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `start_date` date NULL DEFAULT 'NULL',
  `end_date` date NULL DEFAULT 'NULL',
  `entry_by` bigint(20) unsigned NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT 'NULL',
  `updated_at` timestamp NULL DEFAULT 'NULL',
  KEY `fk_edp_deduction_type` (`deduction_type_id`),
  KEY `fk_edp_emp` (`emp_id`),
  KEY `fk_edp_entry_by` (`entry_by`),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_edp_entry_by` FOREIGN KEY (`entry_by`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `fk_edp_deduction_type` FOREIGN KEY (`deduction_type_id`) REFERENCES `deduction_types` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_edp_emp` FOREIGN KEY (`emp_id`) REFERENCES `employee_master` (`emp_id`) ON UPDATE CASCADE ON DELETE CASCADE
)
SQL);
    }

    /**
     * Drop the employee_deduction_payments table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_deduction_payments`');
    }
};
