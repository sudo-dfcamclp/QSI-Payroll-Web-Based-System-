<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_basic_rate table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_basic_rate` (
  `rate_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `emp_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `employee_status` tinyint(4) NULL DEFAULT 'NULL',
  `rate_basis` varchar(50) NULL DEFAULT 'NULL',
  `monthly_rate` decimal(12,2) NULL DEFAULT 'NULL',
  `daily_rate` decimal(12,2) NULL DEFAULT 'NULL',
  `hourly_rate` decimal(12,2) NULL DEFAULT 'NULL',
  `effective_date` date NULL DEFAULT 'NULL',
  `end_date` date NULL DEFAULT 'NULL',
  KEY `fk_employee_basic_rate_employee` (`emp_id`),
  PRIMARY KEY (`rate_id`),
  CONSTRAINT `fk_employee_basic_rate_employee` FOREIGN KEY (`emp_id`) REFERENCES `employee_master` (`emp_id`) ON UPDATE CASCADE ON DELETE CASCADE
)
SQL);
    }

    /**
     * Drop the employee_basic_rate table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_basic_rate`');
    }
};
