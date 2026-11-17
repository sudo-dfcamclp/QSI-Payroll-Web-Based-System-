<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the sessions table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL DEFAULT 'NULL',
  `user_id` bigint(20) unsigned NULL DEFAULT 'NULL',
  `ip_address` varchar(45) NULL DEFAULT 'NULL',
  `user_agent` text NULL DEFAULT 'NULL',
  `payload` longtext NOT NULL DEFAULT 'NULL',
  `last_activity` int(11) NOT NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`),
  KEY `sessions_last_activity_index` (`last_activity`),
  KEY `sessions_user_id_index` (`user_id`)
)
SQL);
    }

    /**
     * Drop the sessions table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `sessions`');
    }
};
