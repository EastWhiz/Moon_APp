<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getDashboard()
    {
        $users = User::where('role_id', 2)->count();

        $orders = Order::count();

        $card_orders = Order::wherehas('cards')->count();

        $simple_orders = Order::whereDoesntHave('cards')->count();

        $object['data'] = $users;
        $object['data2'] = $orders;
        $object['data3'] = $card_orders;
        $object['data4'] = $simple_orders;

        $result = User::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $resultTwo = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();


        // Fill in the missing months with zero count
        $userCountByMonth = [];
        for ($i = 1; $i <= 12; $i++) {
            $userCountByMonth[] = $result[$i] ?? 0;
        }
        $userCountByMonthTwo = [];
        for ($i = 1; $i <= 12; $i++) {
            $userCountByMonthTwo[] = $resultTwo[$i] ?? 0;
        }

        return sendResponse(true, "Dashboard Data Shown", $object, $userCountByMonth, $userCountByMonthTwo);
    }
}
