<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Admin\AdminController;
use App\Models\SliderModel as MainModel;
use App\Http\Requests\SliderRequest as MainRequest ;    
use Illuminate\Http\Request; 

class SliderController extends AdminController
{
    protected $pathViewController = 'admin.pages.slider.';  // slider
    protected $controllerName     = 'slider';
    protected $params             = [];
    protected $model;

    public function __construct()
    {
        $this->model = new MainModel();
        parent::__construct();
    }
   
    public function save(MainRequest $request)
    {
        if ($request->method() == 'POST') {
            $params = $request->all();
            
            $task   = "add-item";
            $notify = "Thêm phần tử thành công!";

            if($params['id'] !== null) {
                $task   = "edit-item";
                $notify = "Cập nhật phần tử thành công!";
            }
            $this->model->saveItem($params, ['task' => $task]);
            return redirect()->route($this->controllerName)->with("zvn_notify", $notify);
        }
    }

}