<?php 
class final_rest
{



	/**
	 * @api  /api/v1/setTemp/
	 * @apiName setTemp
	 * @apiDescription Add remote temperature measurement
	 *
	 * @apiParam {string} location
	 * @apiParam {String} sensor
	 * @apiParam {double} value
	 *
	 * @apiSuccess {Integer} status
	 * @apiSuccess {string} message
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *              "status":0,
	 *              "message": ""
	 *     }
	 *
	 * @apiError Invalid data types
	 *
	 * @apiErrorExample Error-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *              "status":1,
	 *              "message":"Error Message"
	 *     }
	 *
	 */
	public static function setTemp ($location, $sensor, $value)

	{
		if (!is_numeric($value)) {
			$retData["status"]=1;
			$retData["message"]="'$value' is not numeric";
		}
		else {
			try {
				EXEC_SQL("insert into temperature (location, sensor, value, date) values (?,?,?,CURRENT_TIMESTAMP)",$location, $sensor, $value);
				$retData["status"]=0;
				$retData["message"]="insert of '$value' for location: '$location' and sensor '$sensor' accepted";
			}
			catch  (Exception $e) {
				$retData["status"]=1;
				$retData["message"]=$e->getMessage();
			}
		}

		return json_encode ($retData);
	}

	public static function getProduct ($category, $subcategory, $id)
	{
		try {
			$retData["result"] = GET_SQL("select * from product where category like ? and subcategory like ? and (product_id = ? or ? = '0') order by description", $category,$subcategory,$id,$id);
			$retData["status"]=0;
			$retData["message"]="Get product of '$id' for category: '$category' and subcategory '$subcategory' accepted";
		}
		catch  (Exception $e) {
			$retData["status"]=1;
			$retData["message"]="ERROR for getting product of '$id' for category: '$category' and subcategory '$subcategory'";
		}

		return json_encode ($retData);
	}

	public static function getProductByPrice ($min, $max)
        {
                try {
                        $retData["result"] = GET_SQL("select * from product where price >= ? AND price <= ? order by description", $min, $max);
                        $retData["status"]=0;
                        $retData["message"]="Get products with price between '$min' and '$max' accepted";
                }
                catch  (Exception $e) {
                        $retData["status"]=1;
                        $retData["message"]="ERROR for getting  products with price between '$min' and '$max'";
                }

                return json_encode ($retData);
	}

	public static function orderProducts ($category)
        {
		try {
			if($category=="subCategory"){		
                        	$retData["result"] = GET_SQL("select * from product order by subcategory");
                        	$retData["status"]=0;
				$retData["message"]="Ordered proeducts by '$category'";
			}
			else if($category=="category"){
                                $retData["result"] = GET_SQL("select * from product order by category");
                                $retData["status"]=0;
                                $retData["message"]="Ordered proeducts by '$category'";
                        }
			else if($category=="lowPrice"){
                                $retData["result"] = GET_SQL("select * from product order by price ASC");
                                $retData["status"]=0;
                                $retData["message"]="Ordered proeducts by '$category'";
			}
			else if($category=="highPrice"){
                                $retData["result"] = GET_SQL("select * from product order by price DESC");
                                $retData["status"]=0;
                                $retData["message"]="Ordered proeducts by '$category'";
			}
			else {
           			$retData["status"] = 1;
            			$retData["message"] = "Invalid category '$category'";
        		}
                }
                catch  (Exception $e) {
                        $retData["status"]=1;
                        $retData["message"]="ERROR for getting  products with category '$category'";
                }

                return json_encode ($retData);
	}

	public static function getCategories(){
		$retData["result"] = GET_SQL("SELECT DISTINCT Category FROM product");
		$retData["status"]=0;
		$retData["message"]="All distinct categories of products";
		return json_encode ($retData);
	}

	public static function getSubCategories(){
                $retData["result"] = GET_SQL("SELECT DISTINCT subCategory FROM product");
                $retData["status"]=0;
                $retData["message"]="All distinct sub-categories of products";
                return json_encode ($retData);
        }
	
	public static function addOrder($order_id,$product_id){
		if (!is_numeric($order_id)) {
			$retData["status"]=1;
			$retData["message"]="'$order_id' is not numeric";
		}
		else if (!is_numeric($product_id)) {
			$retData["status"]=1;
			$retData["message"]="'$product_id' is not numeric";
		}
		else{
			EXEC_SQL("insert into orders (order_id, product_id, orderDate) values (?,?, CURRENT_TIMESTAMP)",$order_id,$product_id);
			$retData["status"]=0;
			$retData["message"]="Added product '$product_id' to order '$order_id'";
		}
		return json_encode ($retData);
	}

	public static function getMostRecentOrderNum(){
		$retData["result"] = GET_SQL("SELECT COUNT(distinct order_id) AS order_id FROM orders");
                $retData["status"]=0;
                $retData["message"]="Most recent order number found";
                return json_encode ($retData);
	}

	public static function getAllOrders(){
		$retData["result"] = GET_SQL("SELECT o.order_id, o.orderDate, COUNT(*) AS numItems, SUM(p.price) AS totPrice FROM orders o LEFT JOIN product p ON o.product_id = p.product_id GROUP BY o.order_id ORDER BY o.orderDate DESC");
		$retData["status"] = 0;
		$retData["message"] = "Retreived all orders";
		return json_encode ($retData);
	}

	public static function getOrder($order_id){
		if (!is_numeric($order_id)) {
			$retData["status"]=1;
			$retData["message"]="'$order_id' is not numeric";
		}
		else{
			$retData["result"] = GET_SQL("SELECT o.product_id, p.title, p.price FROM orders o LEFT JOIN product p ON o.product_id = p.product_id WHERE o.order_id = ?",$order_id);
			$retData["status"] = 0;
			$retData["message"] = "Retreived order with id '$order_id'";
			return json_encode ($retData);
		}

	}
}

