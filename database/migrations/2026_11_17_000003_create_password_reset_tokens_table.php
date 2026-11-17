<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the password_reset_tokens table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL DEFAULT 'NULL',
  `token` varchar(255) NOT NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT 'NULL',
  PRIMARY KEY (`email`)
)
SQL);
    }

    /**
     * Drop the password_reset_tokens table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `password_reset_tokens`');
    }
};
