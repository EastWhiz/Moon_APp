<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrdersController extends Controller
{
    public function getOrders(Request $request)
    {
        $user = null;
        if (isset($request->shop)) {
            $user = Auth::user();
        }

        $shops = Order::with(['items', 'shop', 'cards', 'messages'])
            ->when(!$request->get('q6'), function ($q) use ($request) {
                $q->where(function ($query) {
                    $query->orWhereHas('cards')->orWhereHas('messages');
                });
            })
            ->when($request->get('q6'), function ($q) use ($request) {
                $type = json_decode($request->get('q6'));
                $q->when($type[0] == "card", function ($q) use ($request) {
                    $q->where(function ($query) {
                        $query->orWhereHas('cards');
                    });
                });
                $q->when($type[0] == "message", function ($q) use ($request) {
                    $q->where(function ($query) {
                        $query->orWhereHas('messages');
                    });
                });
            })
            ->when($request->get('q'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('order_id', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('email', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('customer_name', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('order_name', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('final_total', 'LIKE', '%' . $request->q . '%');
                });
            })->when($request->get('q2'), function ($q) use ($request) {
                $q->whereIn('user_id', json_decode($request->q2));
            })->when($user, function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->when($request->get('q5'), function ($q) use ($request) {
                $q->when($request->get('q5') == "id asc", function ($q) {
                    $q->orderBy("id", "asc");
                });
                $q->when($request->get('q5') == "id desc", function ($q) {
                    $q->orderBy("id", "desc");
                });
            })
            ->with(['shop' => function ($query) {
                $query->withTrashed(); // Include soft-deleted shops
            }])
            ->cursorPaginate($request->page_count);

        $shops_filter = User::where('role_id', 2)->get();

        return sendResponse(true, 'Orders retrieved successfully!', $shops, $shops_filter);
    }
}
