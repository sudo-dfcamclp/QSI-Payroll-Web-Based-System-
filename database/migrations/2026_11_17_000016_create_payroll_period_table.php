<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the payroll_period table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `payroll_period` (
  `period_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `client_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `legacy_client_id` bigint(20) NULL DEFAULT 'NULL',
  `month_no` int(11) NULL DEFAULT 'NULL',
  `start_date` date NOT NULL DEFAULT 'NULL',
  `end_date` date NOT NULL DEFAULT 'NULL',
  `cutoff_no` int(11) NULL DEFAULT 'NULL',
  `processed_by` bigint(20) unsigned NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  KEY `fk_payroll_period_processed_by` (`processed_by`),
  KEY `idx_payroll_period_client` (`client_id`),
  KEY `idx_payroll_period_legacy_client` (`legacy_client_id`),
  PRIMARY KEY (`period_id`),
  CONSTRAINT `fk_payroll_period_client` FOREIGN KEY (`client_id`) REFERENCES `client_master` (`client_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_payroll_period_processed_by` FOREIGN KEY (`processed_by`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE ON DELETE SET NULL
)
SQL);
    }

    /**
     * Drop the payroll_period table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `payroll_period`');
    }
};
