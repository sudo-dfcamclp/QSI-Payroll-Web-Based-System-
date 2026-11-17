<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the cutoff_config table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `cutoff_config` (
  `id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `cutoff_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL',
  `f_from` date NULL DEFAULT 'NULL',
  `f_to` date NULL DEFAULT 'NULL',
  `l_from` date NULL DEFAULT 'NULL',
  `l_to` date NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT 'NULL',
  `updated_at` timestamp NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`)
)
SQL);
    }

    /**
     * Drop the cutoff_config table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `cutoff_config`');
    }
};
