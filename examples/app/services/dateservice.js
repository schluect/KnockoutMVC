var examples = examples ||{};
examples.DateService = function(){
  return {
      GetTestDate: function(){
          return "2014-01-28";
      }
  };
};
komvc.RegisterService("DateService",examples.DateService);
