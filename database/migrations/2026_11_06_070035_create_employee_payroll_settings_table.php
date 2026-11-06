<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_payroll_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('emp_id');
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('period_id');
            
            // Ang mga switches (MODE)
            $table->boolean('deduct_sss')->default(true);
            $table->boolean('deduct_pagibig')->default(true);
            $table->boolean('deduct_philhealth')->default(true);
            $table->boolean('deduct_tax')->default(true);

            $table->timestamps();

            // Isang record lang per employee per period
            $table->unique(['employee_id', 'period_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_payroll_settings');
    }
};