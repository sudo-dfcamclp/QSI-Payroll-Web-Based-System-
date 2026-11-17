<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the cache table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL DEFAULT 'NULL',
  `value` mediumtext NOT NULL DEFAULT 'NULL',
  `expiration` int(11) NOT NULL DEFAULT 'NULL',
  KEY `cache_expiration_index` (`expiration`),
  PRIMARY KEY (`key`)
)
SQL);
    }

    /**
     * Drop the cache table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `cache`');
    }
};
