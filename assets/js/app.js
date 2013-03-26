;(function($, window) {
	
	var TableBuilder  = function(obj, options){
		
		var t = {
			obj: $(obj),
			db: false,
			options: false,
			columns: []
		};
		
		var _default = {
			options: {
				database: 'database',
				dataTable: 'datatable'
			}
		};
		
		if(typeof options != "object") {
			options = {};
		}

		t = $.extend(true, t, _default, options);
		
		t.setColumns = function(cols) {
			if(typeof cols != "array") {
				cols = [];
			}
			
			t.columns = cols;
		}
		
		t.getColumns = function() {
			return t.columns;
		}
		
		t.getData = function() {
			return t.db.query(t.options.dataTable);
		}
		
		t.addRow = function(data) {
			t.db.insert(t.options.dataTable, data);
			t.db.commit();
		}
		
		t.getRow = function(id) {
			return t.db.query(t.options.dataTable, {ID: id});
		}
		
		t.getRows = function(params) {
			if(typeof params != "object") {
				var params = {};
			}
			
			return t.db.query(t.options.dataTable, params);
		}
		
		t.getHeaders = function() {
		
		}
		
		t.loadDatabase = function(database) {
			if(!database) {
				var database = t.options.database;
			}
			
			t.db = new localStorageDB(database, localStorage);
			
			return t.db;
		}
		
		t.createTable = function(dataTable, columns) {
			if(!dataTable) {
				var dataTable = t.options.dataTable;
			}
			
			if(!columns) {
				var columns = t.columns;
			}
			
			if(t.options.columns.length > 0) {
				t.db.createTable(dataTable, t.columns);
			}
		}
		
		t.doesTableExist = function(dataTable) {
			if(!dataTable) {
				var dataTable = t.options.dataTable;
			}
			
			return t.db.tableExists(dataTable);
		}
		
		t.deleteTable = function(dataTable) {		
			if(!dataTable) {
				var dataTable = t.options.dataTable;
			}
			
			t.db.dropTable(dataTable);
		}
		
		t.init = function() {
			
			t.loadDatabase();
			
			if(!t.doesTableExist()) {
				t.db.createTable(t.options.dataTable, t.getColumns());
				t.db.commit();
			}
			
			t.render();
		}
		
		t.render = function() {
			// 1. get table columns
			// 2. build the table structure and headers
			// 3. build the table rows
			var html = [];
			var columns = t.getColumns();
			
			html.push('<table>');
			html.push('<thead>');
			html.push('<tr>');
			html.push('<th></th>');
					
			$.each(columns, function(i, column) {
				html.push('<th>'+column+'</th>');
			});
			
			html.push('</tr>');
			html.push('</thead>');
			html.push('<tbody>');
			
			var data = t.getData();
			
			if(data.length == 0) {
				html.push('<tr><td colspan="'+(columns.length+1)+'">There is no data in the "'+t.options.dataTable+'" datatable.</td></tr>');
			}
			else {
				
				$.each(data, function(i, row) {
					var newRow = ['<tr>'];
					
					$.each(row, function(columnName, columnValue) {
						newRow.push('<td>'+columnValue+'</td>');					
					});
					
					newRow.push('</tr>');
					
					html.push(newRow.join(''));
				});
			}
			
			html.push('</tbody>');
			html.push('</table>');
			
			var tableString = html.join('');
			
			t.obj.html(tableString);
		}
		
		t.init();

		return t;
	};
	
	$.fn.TableBuilder = function(options) {
		return new TableBuilder($(this), options);
	}
	
	// Some sample Javascript functions:
    $(function(){
		
		// first, last, address, city, state, zip
		
		var TB1 = $('.table1').TableBuilder({
			options: {
				database: 'examples',
				dataTable: 'table3',
			},
			columns: ['first', 'last', 'address', 'city', 'state', 'zip']
		});
		
		var TB2 = $('.table2').TableBuilder({
			options: {
				database: 'examples',
				dataTable: 'table2',
			},
			columns: ['first', 'last', 'address', 'city', 'state', 'zip']
		});
		
		$('#record').submit(function(e) {
			
			var $t = $(this);
			
			var first = $t.find('#first').val();
			var last = $t.find('#last').val();
			var address = $t.find('#address').val();
			var city = $t.find('#city').val();
			var state = $t.find('#state').val();
			var zipcode = $t.find('#zipcode').val();
			
			var newRow = {
				'first': first,
				'last': last,
				'address': address,
				'city': city,
				'state': state,
				'zip': zipcode
			};
			
			TB1.addRow(newRow);
			TB1.render();
			
			$t.find('input').val('');
			$t.find('input:first').focus();
			
			e.preventDefault();
		});

    });
}(jQuery, this));