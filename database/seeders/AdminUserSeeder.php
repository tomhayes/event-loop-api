<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if it doesn't exist
        User::firstOrCreate(
            ['email' => 'admin@eventloop.dev'],
            [
                'name' => 'Admin User',
                'username' => 'admin',
                'email' => 'admin@eventloop.dev',
                'password' => Hash::make('adminpassword'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@eventloop.dev');
        $this->command->info('Username: admin');
        $this->command->info('Password: adminpassword');
        $this->command->info('Please change the password after first login.');
    }
}
