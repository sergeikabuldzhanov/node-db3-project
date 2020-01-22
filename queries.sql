-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.

    select productname, categoryname from product p join category c on c.id=p.categoryid;

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records.

    select o.id order_id, companyname from [order] o join shipper s on shipvia=s.id where orderdate<"2012-08-09";

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.

    select productname, quantity from orderdetail od join [order] o on orderid=o.id join product p on productid=p.id where orderid=10251 group by productid;

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.

    select o.id, c.companyname, e.lastname from [order] o join customer c on o.CustomerId=c.Id join employee e on e.id=o.EmployeeId;