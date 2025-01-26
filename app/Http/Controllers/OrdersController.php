<?php

namespace App\Http\Controllers;

use App\Models\OrderPrint;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrdersController extends Controller
{
    public function getPrints(Request $request)
    {
        $shops = OrderPrint::with(['order', 'user'])
            ->when($request->get('q'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('design', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('title', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('titleFont', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('paragraphText', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('paragraphTextFont', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('selectedDate', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('city', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('status', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('link', 'LIKE', '%' . $request->q . '%');
                });
            })->when($request->get('q5'), function ($q) use ($request) {
                $q->when($request->get('q5') == "id asc", function ($q) {
                    $q->orderBy("id", "asc");
                });
                $q->when($request->get('q5') == "id desc", function ($q) {
                    $q->orderBy("id", "desc");
                });
            })
            ->with(['user' => function ($query) {
                $query->withTrashed(); // Include soft-deleted shops
            }])
            ->cursorPaginate($request->page_count);

        $shops_filter = User::where('role_id', 2)->get();

        return sendResponse(true, 'Prints retrieved successfully!', $shops, $shops_filter);
    }
}
