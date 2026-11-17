<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the users table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `users` (
  `user_id` bigint(20) unsigned NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `username` varchar(255) NOT NULL DEFAULT 'NULL',
  `email` varchar(255) NOT NULL DEFAULT 'NULL',
  `profile` varchar(255) NULL DEFAULT 'NULL',
  `password` varchar(255) NOT NULL DEFAULT 'NULL',
  `status` varchar(50) NOT NULL DEFAULT '''pending''',
  `remember_token` varchar(100) NULL DEFAULT 'NULL',
  `created_at` timestamp NULL DEFAULT 'NULL',
  `updated_at` timestamp NULL DEFAULT 'NULL',
  `delete_at` timestamp NULL DEFAULT 'NULL',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `users_email_unique` (`email`)
)
SQL);
    }

    /**
     * Drop the users table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `users`');
    }
};
