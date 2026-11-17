<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the employee_master table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `employee_master` (
  `emp_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `employee_num` bigint(20) NULL DEFAULT 'NULL',
  `client_id` bigint(20) unsigned NULL DEFAULT 'NULL',
  `legacy_client_id` varchar(50) NULL DEFAULT 'NULL',
  `contact_no` varchar(50) NULL DEFAULT 'NULL',
  `badge_no` varchar(50) NULL DEFAULT 'NULL',
  `nickname` varchar(100) NULL DEFAULT 'NULL',
  `last_name` varchar(100) NOT NULL DEFAULT 'NULL',
  `first_name` varchar(100) NOT NULL DEFAULT 'NULL',
  `middle_name` varchar(100) NULL DEFAULT 'NULL',
  `suffix_name` varchar(50) NULL DEFAULT 'NULL',
  `birth_date` date NULL DEFAULT 'NULL',
  `birth_place` varchar(255) NULL DEFAULT 'NULL',
  `citizenship` varchar(100) NULL DEFAULT 'NULL',
  `gender` varchar(50) NULL DEFAULT 'NULL',
  `civil_status` varchar(50) NULL DEFAULT 'NULL',
  `weight` decimal(6,2) NULL DEFAULT 'NULL',
  `height` decimal(6,2) NULL DEFAULT 'NULL',
  `religion` varchar(100) NULL DEFAULT 'NULL',
  `house_no` varchar(50) NULL DEFAULT 'NULL',
  `street` varchar(150) NULL DEFAULT 'NULL',
  `barangay` varchar(150) NULL DEFAULT 'NULL',
  `district` varchar(150) NULL DEFAULT 'NULL',
  `city` varchar(150) NULL DEFAULT 'NULL',
  `town` varchar(150) NULL DEFAULT 'NULL',
  `contact` varchar(100) NULL DEFAULT 'NULL',
  `phone` varchar(50) NULL DEFAULT 'NULL',
  `primary_education` varchar(255) NULL DEFAULT 'NULL',
  `secondary_education` varchar(255) NULL DEFAULT 'NULL',
  `college` varchar(255) NULL DEFAULT 'NULL',
  `degree` varchar(255) NULL DEFAULT 'NULL',
  `major` varchar(255) NULL DEFAULT 'NULL',
  `post_grad` varchar(255) NULL DEFAULT 'NULL',
  `course` varchar(255) NULL DEFAULT 'NULL',
  `sss_no` varchar(50) NULL DEFAULT 'NULL',
  `philhealth_no` varchar(50) NULL DEFAULT 'NULL',
  `pagibig_no` varchar(50) NULL DEFAULT 'NULL',
  `tin_no` varchar(50) NULL DEFAULT 'NULL',
  `employment_status` varchar(50) NULL DEFAULT 'NULL',
  `remarks` text NULL DEFAULT 'NULL',
  `position` varchar(150) NULL DEFAULT 'NULL',
  `company` varchar(255) NULL DEFAULT 'NULL',
  `branch` varchar(150) NULL DEFAULT 'NULL',
  `department` varchar(150) NULL DEFAULT 'NULL',
  `date_hired` date NULL DEFAULT 'NULL',
  `date_resigned` date NULL DEFAULT 'NULL',
  `status` enum('active','archive') NOT NULL DEFAULT '''active''',
  `start_contract` date NULL DEFAULT 'NULL',
  `end_contract` date NULL DEFAULT 'NULL',
  `rate_basis` varchar(50) NULL DEFAULT 'NULL',
  `month_no` int(11) NULL DEFAULT 'NULL',
  `date_reg` date NULL DEFAULT 'NULL',
  `date_prob` date NULL DEFAULT 'NULL',
  `insurance_no` varchar(100) NULL DEFAULT 'NULL',
  `agency_fee` decimal(12,2) NULL DEFAULT 'NULL',
  `agency` varchar(255) NULL DEFAULT 'NULL',
  `account_no` varchar(100) NULL DEFAULT 'NULL',
  `expanded_tax` decimal(12,2) NULL DEFAULT 'NULL',
  `allowance` decimal(12,2) NULL DEFAULT 'NULL',
  `with_ecol` tinyint(1) NOT NULL DEFAULT 0,
  `profile_photo` varchar(255) NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_employee_client` (`client_id`),
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `uq_employee_master_employee_num` (`employee_num`),
  CONSTRAINT `fk_employee_client` FOREIGN KEY (`client_id`) REFERENCES `client_master` (`client_id`) ON UPDATE CASCADE ON DELETE SET NULL
)
SQL);
    }

    /**
     * Drop the employee_master table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `employee_master`');
    }
};
