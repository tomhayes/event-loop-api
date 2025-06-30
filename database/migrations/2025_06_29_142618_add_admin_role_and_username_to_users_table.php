<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add username field - unique, alphanumeric only
            $table->string('username')->unique()->after('name');
            
            // Update role enum to include admin
            $table->dropColumn('role');
        });
        
        // Re-add role column with admin option
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['attendee', 'organizer', 'admin'])->default('attendee')->after('username');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remove username field
            $table->dropUnique(['username']);
            $table->dropColumn('username');
            
            // Revert role enum to original values
            $table->dropColumn('role');
        });
        
        // Re-add original role column
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['attendee', 'organizer'])->default('attendee')->after('email');
        });
    }
};
