<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{ 
    protected $pathViewController = '';
    protected $controllerName     = '';
    protected $params             = [];
    protected $model;
 
    public function __construct()
    {
        $this->params["pagination"]["totalItemsPerPage"] = 15;
        view()->share('controllerName', $this->controllerName);
    }
 
    public function index(Request $request)
    { 
        //return abort(404);  $this->params,
        $this->params['filter']['status'] = $request->input('filter_status', 'all' ) ;
        $this->params['search']['field']  = $request->input('search_field', '' ) ;
        $this->params['filter']['category_id']  = $request->input('category_id', '' ) ;
        $this->params['filter']['id']  = $request->input('category_id', '' ) ;
        $this->params['search']['value']  = $request->input('search_value', '' ) ;

        $items              = $this->model->listItems($this->params, ['task'  => 'admin-list-items']);
        $itemsStatusCount   = $this->model->countItems($this->params, ['task' => 'admin-count-items-group-by-status']); // [ ['status', 'count']]

        return view($this->pathViewController .  'index', [
            'params'        => $this->params,
            'items'         => $items,
            'itemsStatusCount' =>  $itemsStatusCount
        ]);
    }
 
    public function form(Request $request)
    {
        $item = null;
        if($request->id != null ) {
            $params["id"] = $request->id;
            $item = $this->model->getItem( $params, ['task' => 'get-item']);
        }
        return view($this->pathViewController .  'form', [
            'item'        => $item
        ]);
    }
 
    public function status(Request $request)
    {
       
        $params["currentStatus"]  = $request->status;
        $params["id"]             = $request->id;
        $result = $this->model->saveItem($params, ['task' => 'change-status']);
        echo json_encode($result);
    }

    public function delete(Request $request)
    {
        $params["id"]             = $request->id;
        $this->model->deleteItem($params, ['task' => 'delete-item']);
        return redirect()->route($this->controllerName)->with('zvn_notify', 'Xóa phần tử thành công!');
    }
}