<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the client_master table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `client_master` (
  `client_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `legacy_client_id` bigint(20) unsigned NULL DEFAULT 'NULL',
  `client_name` varchar(150) NOT NULL DEFAULT 'NULL',
  `client_address` text NULL DEFAULT 'NULL',
  `client_contact` varchar(30) NULL DEFAULT 'NULL',
  `client_contact2` varchar(30) NULL DEFAULT 'NULL',
  `client_owner` varchar(150) NULL DEFAULT 'NULL',
  `contact_person` varchar(150) NULL DEFAULT 'NULL',
  `contact_position` varchar(100) NULL DEFAULT 'NULL',
  `client_assistant` varchar(150) NULL DEFAULT 'NULL',
  `assistant_position` varchar(100) NULL DEFAULT 'NULL',
  `permit_no` varchar(100) NULL DEFAULT 'NULL',
  `bank_name` varchar(150) NULL DEFAULT 'NULL',
  `account_no` varchar(100) NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) NOT NULL DEFAULT '''active''',
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `uq_client_master_legacy_client_id` (`legacy_client_id`)
)
SQL);
    }

    /**
     * Drop the client_master table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `client_master`');
    }
};
