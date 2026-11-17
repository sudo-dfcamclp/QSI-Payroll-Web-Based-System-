<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the client_payroll_config table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `client_payroll_config` (
  `config_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `client_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `payroll_frequency` varchar(30) NOT NULL DEFAULT '''Semi-Monthly''',
  `working_days_per_cutoff` decimal(5,2) NULL DEFAULT 'NULL',
  `working_days_per_year` decimal(6,2) NULL DEFAULT 'NULL',
  `working_days_per_month` decimal(5,2) NULL DEFAULT 'NULL',
  `hours_per_day` decimal(5,2) NULL DEFAULT 'NULL',
  `include_13th_month_pay` tinyint(1) NOT NULL DEFAULT 0,
  `add_13th_month_to_gross_pay` tinyint(1) NOT NULL DEFAULT 0,
  `agency_fee_basis` varchar(50) NULL DEFAULT 'NULL',
  `agency_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `client_charge_per_day` decimal(12,2) NULL DEFAULT 'NULL',
  `tardiness_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `late_charge_per_minute` decimal(12,2) NULL DEFAULT 'NULL',
  `regular_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `rest_day_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `rest_day_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `special_holiday_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `legal_holiday_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `night_differential_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `special_holiday_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `special_holiday_rest_day_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `special_holiday_rest_day_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `legal_holiday_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `legal_holiday_rest_day_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `legal_holiday_rest_day_overtime_rate` decimal(8,4) NULL DEFAULT 'NULL',
  `ecola_allowance_payment` decimal(12,2) NULL DEFAULT 'NULL',
  `ecola_taxable` tinyint(1) NOT NULL DEFAULT 0,
  `ecola_on_rest_days` tinyint(1) NOT NULL DEFAULT 0,
  `ecola_on_holidays` tinyint(1) NOT NULL DEFAULT 0,
  `withhold_tax` tinyint(1) NOT NULL DEFAULT 0,
  `use_fixed_rate_for_tax` tinyint(1) NOT NULL DEFAULT 0,
  `withhold_sss` tinyint(1) NOT NULL DEFAULT 0,
  `half_sss_monthly_basis` tinyint(1) NOT NULL DEFAULT 0,
  `sss_add_on` decimal(12,2) NULL DEFAULT 'NULL',
  `withhold_philhealth` tinyint(1) NOT NULL DEFAULT 0,
  `philhealth_add_on` decimal(12,2) NULL DEFAULT 'NULL',
  `withhold_pagibig` tinyint(1) NOT NULL DEFAULT 0,
  `exclude_sss_pagibig_from_tax` tinyint(1) NOT NULL DEFAULT 0,
  `admin_fee` decimal(12,2) NULL DEFAULT 'NULL',
  `vat` decimal(8,4) NULL DEFAULT 'NULL',
  `vat_reference` varchar(100) NULL DEFAULT 'NULL',
  `billing_schedule` varchar(100) NULL DEFAULT 'NULL',
  `billing_template` varchar(100) NULL DEFAULT 'NULL',
  `meal_on_bill` tinyint(1) NOT NULL DEFAULT 0,
  `vale_on_bill` tinyint(1) NOT NULL DEFAULT 0,
  `severance_pay` tinyint(1) NOT NULL DEFAULT 0,
  `cutoff_period` varchar(100) NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `uq_client_payroll_config_client` (`client_id`),
  CONSTRAINT `fk_client_payroll_config_client` FOREIGN KEY (`client_id`) REFERENCES `client_master` (`client_id`) ON UPDATE CASCADE ON DELETE CASCADE
)
SQL);
    }

    /**
     * Drop the client_payroll_config table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `client_payroll_config`');
    }
};
