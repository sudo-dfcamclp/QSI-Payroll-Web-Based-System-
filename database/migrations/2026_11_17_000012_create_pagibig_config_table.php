<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the pagibig_config table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `pagibig_config` (
  `id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `min_wage` decimal(12,2) NOT NULL DEFAULT 0.00,
  `max_wage` decimal(12,2) NULL DEFAULT 'NULL',
  `pagibig_ee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `pagibig_er` decimal(12,2) NOT NULL DEFAULT 0.00,
  `pagibig_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `pagibig_max` decimal(12,2) NOT NULL DEFAULT 0.00,
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
     * Drop the pagibig_config table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `pagibig_config`');
    }
};
