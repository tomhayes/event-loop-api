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
            $table->string('short_description', 200)->nullable()->after('description');
            $table->text('long_description')->nullable()->after('short_description');
            $table->string('header_image')->nullable()->after('long_description');
            $table->string('organizer_logo')->nullable()->after('header_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['short_description', 'long_description', 'header_image', 'organizer_logo']);
        });
    }
};
