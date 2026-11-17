<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_payroll_settings table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_payroll_settings` (
  `id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `emp_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `client_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `period_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `deduct_sss` tinyint(1) NULL DEFAULT 1,
  `deduct_pagibig` tinyint(1) NULL DEFAULT 1,
  `deduct_philhealth` tinyint(1) NULL DEFAULT 1,
  `deduct_tax` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT 'NULL',
  `updated_at` timestamp NULL DEFAULT 'NULL',
  KEY `period_id` (`period_id`),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_emp_period` (`emp_id`, `period_id`),
  CONSTRAINT `employee_payroll_settings_ibfk_2` FOREIGN KEY (`period_id`) REFERENCES `payroll_period` (`period_id`) ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT `employee_payroll_settings_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee_master` (`emp_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
SQL);
    }

    /**
     * Drop the employee_payroll_settings table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_payroll_settings`');
    }
};
