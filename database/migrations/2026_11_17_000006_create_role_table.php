<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Create the role table using the captured MySQL schema.
     * Generated from the supplied INFORMATION_SCHEMA exports.
     */
    public function up(): void
    {
        DB::unprepared(<<<'SQL'
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL DEFAULT 'NULL' AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL DEFAULT 'NULL',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UQ_roles_role_name` (`role_name`)
)
SQL);
    }

    /**
     * Drop the role table when rolling back this migration.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS `role`');
    }
};
