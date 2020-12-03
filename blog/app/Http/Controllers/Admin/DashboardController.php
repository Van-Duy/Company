<?php

namespace App\Http\Controllers\Admin;
use App\Models\CategoryProductModel;
use App\Models\ArticleModel; 
use App\Models\SliderModel;
use App\Models\MenuModel;
use App\Models\ProductModel;
use App\Models\ContactModel;
// use App\Models\UserModel;
use Illuminate\Http\Request;
  
class DashboardController extends AdminController 
{  
   
    public function __construct()
    {   
        $this->pathViewController = 'admin.pages.dashboard.';  // dashboard
        $this->controllerName     = 'dashboard';
        view()->share('controllerName', $this->controllerName);
    }
     
    public function countItem()
    {
        $countSlider        = SliderModel::count();
        $countCategory      = CategoryProductModel::count();
        $countMenu          = MenuModel::count();
        $countProduct       = ProductModel::count();
        $countArticle       = ArticleModel::count();
        // $countUser          = UserModel::count();
 
        $contactModel = new ContactModel();
        $countContact = $contactModel->listItems(null, ['task' => 'dashboard-list-items']);

        $articleModel = new ArticleModel();
        $items = $articleModel->listItems('null', ['task' => 'dashboard-list-items-latest']);

        return view($this->pathViewController .  'index', compact('countContact','countSlider','countCategory','countMenu','countProduct', 'countArticle', 'items'));
    }

}

 