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
        Schema::table('events', function (Blueprint $table) {
            // Add user ownership - nullable initially for existing events
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade')->after('id');
            
            // Add event type and tags
            $table->enum('type', ['Meetup', 'Conference', 'Workshop', 'Hackathon'])->default('Meetup')->after('description');
            $table->json('tags')->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Remove foreign key constraint and user_id column
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            
            // Remove type and tags columns
            $table->dropColumn(['type', 'tags']);
        });
    }
};
