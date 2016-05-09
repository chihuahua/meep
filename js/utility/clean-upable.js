goog.provide('meep.utility.CleanUpable');



/**
 * A CleanUpable is an entity that must be cleaned up. For instance, perhaps it
 * has listeners that must be removed at the end of its life time, lest we only
 * partially GC it.
 * @interface
 */
meep.utility.CleanUpable = function() {};


/**
 * Cleans up the object so that it can be wholly GC-ed.
 */
meep.utility.CleanUpable.prototype.cleanUp = function() {};
