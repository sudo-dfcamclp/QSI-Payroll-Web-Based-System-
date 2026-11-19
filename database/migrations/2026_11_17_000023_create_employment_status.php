<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_payroll table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_payroll` (
  `payroll_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `period_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `client_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `emp_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `legacy_client_id` bigint(20) NULL DEFAULT 'NULL',
  `employee_num` bigint(20) NULL DEFAULT 'NULL',
  `control_no` varchar(40) NULL DEFAULT 'NULL',
  `days_present` decimal(10,2) NULL DEFAULT 0.00,
  `basic_pay` decimal(12,2) NULL DEFAULT 0.00,
  `ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `excess_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `excess_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `night_diff_ot` decimal(10,2) NULL DEFAULT 0.00,
  `night_diff_pay` decimal(12,2) NULL DEFAULT 0.00,
  `rest_day_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `rest_day_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `sunday_ot` decimal(10,2) NULL DEFAULT 0.00,
  `sunday_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `sp_hol_days` decimal(10,2) NULL DEFAULT 0.00,
  `sp_hol_pay` decimal(12,2) NULL DEFAULT 0.00,
  `sp_hol_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `sp_hol_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `excess_sp_hol_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `excess_sp_hol_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `leg_hol_days` decimal(10,2) NULL DEFAULT 0.00,
  `leg_hol_pay` decimal(12,2) NULL DEFAULT 0.00,
  `leg_hol_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `leg_hol_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `excess_leg_hol_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `excess_leg_hol_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `excess_sun_leg_ot_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `excess_sun_leg_ot_pay` decimal(12,2) NULL DEFAULT 0.00,
  `ot_no_prem_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `ot_no_prem_pay` decimal(12,2) NULL DEFAULT 0.00,
  `vl_days` decimal(10,2) NULL DEFAULT 0.00,
  `vl_pay` decimal(12,2) NULL DEFAULT 0.00,
  `sl_days` decimal(10,2) NULL DEFAULT 0.00,
  `sl_pay` decimal(12,2) NULL DEFAULT 0.00,
  `salary_adj` decimal(12,2) NULL DEFAULT 0.00,
  `incentive_pay` decimal(12,2) NULL DEFAULT 0.00,
  `incentive_remarks` text NULL DEFAULT 'NULL',
  `ecola_pay` decimal(12,2) NULL DEFAULT 0.00,
  `m13_rate` decimal(12,2) NULL DEFAULT 0.00,
  `m13_pay` decimal(12,2) NULL DEFAULT 0.00,
  `gross_pay` decimal(12,2) NULL DEFAULT 0.00,
  `days_absent` decimal(10,2) NULL DEFAULT 0.00,
  `absent_ded` decimal(12,2) NULL DEFAULT 0.00,
  `tardy_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `tardy_ded` decimal(12,2) NULL DEFAULT 0.00,
  `agency_charge` decimal(12,2) NULL DEFAULT 0.00,
  `over_under_pay` decimal(12,2) NULL DEFAULT 0.00,
  `vale_iou` decimal(12,2) NULL DEFAULT 0.00,
  `sss_ee` decimal(12,2) NULL DEFAULT 0.00,
  `sss_er` decimal(12,2) NULL DEFAULT 0.00,
  `ecc_er` decimal(12,2) NULL DEFAULT 0.00,
  `philhealth_ee` decimal(12,2) NULL DEFAULT 0.00,
  `philhealth_er` decimal(12,2) NULL DEFAULT 0.00,
  `pagibig_ee` decimal(12,2) NULL DEFAULT 0.00,
  `pagibig_er` decimal(12,2) NULL DEFAULT 0.00,
  `wtax` decimal(12,2) NULL DEFAULT 0.00,
  `total_ded` decimal(12,2) NULL DEFAULT 0.00,
  `net_pay` decimal(12,2) NULL DEFAULT 0.00,
  `allowance` decimal(12,2) NULL DEFAULT 0.00,
  `excess_sun_sp_hrs` decimal(10,2) NULL DEFAULT 0.00,
  `excess_sun_sp_pay` decimal(12,2) NULL DEFAULT 0.00,
  `load_allow` decimal(12,2) NULL DEFAULT 0.00,
  `meal_allow` decimal(12,2) NULL DEFAULT 0.00,
  `transpo_allow` decimal(12,2) NULL DEFAULT 0.00,
  `deduct_sss` tinyint(1) NOT NULL DEFAULT 0,
  `deduct_pagibig` tinyint(1) NOT NULL DEFAULT 0,
  `deduct_philhealth` tinyint(1) NOT NULL DEFAULT 0,
  `deduct_meal` tinyint(1) NOT NULL DEFAULT 0,
  `deduct_vale` tinyint(1) NOT NULL DEFAULT 0,
  `deduct_tax` tinyint(1) NOT NULL DEFAULT 0,
  `pay_flag_1` tinyint(1) NOT NULL DEFAULT 0,
  `pay_flag_2` tinyint(1) NOT NULL DEFAULT 0,
  `pay_text_1` varchar(255) NULL DEFAULT 'NULL',
  `pay_text_2` varchar(255) NULL DEFAULT 'NULL',
  `entry_by` bigint(20) unsigned NULL DEFAULT 'NULL',
  `entry_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_emp_payroll_client` (`client_id`),
  KEY `idx_emp_payroll_emp` (`emp_id`),
  KEY `idx_emp_payroll_emp_num` (`employee_num`),
  KEY `idx_emp_payroll_legacy_client` (`legacy_client_id`),
  KEY `idx_emp_payroll_period` (`period_id`),
  PRIMARY KEY (`payroll_id`),
  UNIQUE KEY `uq_emp_payroll_period_emp` (`period_id`, `emp_id`),
  CONSTRAINT `fk_emp_payroll_emp` FOREIGN KEY (`emp_id`) REFERENCES `employee_master` (`emp_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_emp_payroll_period` FOREIGN KEY (`period_id`) REFERENCES `payroll_period` (`period_id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_emp_payroll_client` FOREIGN KEY (`client_id`) REFERENCES `client_master` (`client_id`) ON UPDATE CASCADE ON DELETE RESTRICT
)
SQL);
    }

    /**
     * Drop the employee_payroll table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_payroll`');
    }
};
