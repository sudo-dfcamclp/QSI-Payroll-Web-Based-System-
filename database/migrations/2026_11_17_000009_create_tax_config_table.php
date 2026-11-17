<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the tax_config table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `tax_config` (
  `id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `tax_code` varchar(50) NOT NULL DEFAULT 'NULL',
  `sal_rate1` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sal_rate2` decimal(12,2) NOT NULL DEFAULT 0.00,
  `per_over` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `base_tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `effective_date` date NOT NULL DEFAULT 'NULL',
  `end_date` date NULL DEFAULT 'NULL',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT 'NULL',
  `updated_at` timestamp NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`)
)
SQL);
    }

    /**
     * Drop the tax_config table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `tax_config`');
    }
};
