goog.provide('meep.utility.IdGenerator');



/**
 * Generates numeric IDs unique throughout the life time of the application.
 * This class is a singleton that can be obtained via calling the static
 * getInstance method.
 * @constructor
 */
meep.utility.IdGenerator = function() {
  /**
   * The next ID to dole out.
   * @private {number}
   */
  this.nextId_ = 1;
};


/**
 * The static single instance of the ID generator.
 * @private {!meep.utility.IdGenerator}
 */
meep.utility.IdGenerator.instance_ = new meep.utility.IdGenerator();


/**
 * Gets the single instance of the ID generator. Constructs it if this is the 
 * first time the ID generator is requested.
 * @return {!meep.utility.IdGenerator}
 */
meep.utility.IdGenerator.getInstance = function() {
  return meep.utility.IdGenerator.instance_;
};


/**
 * Generates an ID unique throughout the life time of the application.
 * @return {number}
 */
meep.utility.IdGenerator.prototype.generateId = function() {
  return this.nextId_++;
};
