(function(){
	"use strict";

	angular
		.module("app.services")
		.factory("logger", ['$log', factory]);

	function factory($log){
		var logger = {
			error : error,
			info : info,
			success : success,
			warning : warning
		};

		return logger;

		function error(message, data) {
            $log.error('Error: ' + message, data);
        }

        function info(message, data) {
            $log.info('Info: ' + message, data);
        }

        function success(message, data) {
            $log.info('Success: ' + message, data);
        }

        function warning(message, data) {
            $log.warn('Warning: ' + message, data);
        }
	}

})();