<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\EventLoopSeeder;

class SeedEventLoopData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'eventloop:seed {--fresh : Drop all tables first}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with realistic EventLoop test data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('fresh')) {
            $this->info('🗑️  Dropping all tables and running migrations...');
            $this->call('migrate:fresh');
        }

        $this->info('🌱 Seeding EventLoop data...');
        $this->call('db:seed', ['--class' => EventLoopSeeder::class]);
        
        $this->newLine();
        $this->info('✨ EventLoop data seeded successfully!');
        $this->info('🔗 Visit: http://event-loop-api.test');
    }
}
