<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ShopsController extends Controller
{
    public function getShops(Request $request)
    {
        $shops = User::where('role_id', 2)
            ->when($request->get('q'), function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('name', 'LIKE', '%' . $request->q . '%')
                        ->orWhere('store_name', 'LIKE', '%' . $request->q . '%');
                });
            })->when($request->get('q5'), function ($q) use ($request) {
                $q->when($request->get('q5') == "id asc", function ($q) {
                    $q->orderBy("id", "asc");
                });
                $q->when($request->get('q5') == "id desc", function ($q) {
                    $q->orderBy("id", "desc");
                });
            })->cursorPaginate($request->page_count);

        return sendResponse(true, 'Shops retrieved successfully!', $shops);
    }

    public function enableShop(Request $request)
    {
        $user = User::find($request->user_id);
        $user->status = $request->enable;
        $user->save();

        return sendResponse(true, 'Shop enabled Successfully!');
    }
}
