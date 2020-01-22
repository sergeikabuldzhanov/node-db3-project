//Import knex
const knex = require("knex");

//Import configuration file
const config = require("../knexfile");

//Create knex instance
const db = knex(config.development);

//Setup table name variables
const schemes = "schemes";
const steps = "steps";

/* find():
    Calling find returns a promise that resolves to an array of all schemes in the database.
    No steps are included.
 */
function find() {
  return db(schemes);
}

/* findById(id):
    Expects a scheme id as its only parameter.
    Resolve to a single scheme object.
    On an invalid id, resolves to null.
 */
function findById(id) {
  return db(schemes)
    .where({ id })
    .first();
}

/* findSteps(id):
    Expects a scheme id.
    Resolves to an array of all correctly ordered steps for the given scheme: [ { id: 17, scheme_name: 'Find the Holy Grail', step_number: 1, instructions: 'quest'}, { id: 18, scheme_name: 'Find the Holy Grail', step_number: 2, instructions: '...and quest'}, etc. ].
    This array should include the scheme_name not the scheme_id.
 */
function findSteps(id) {
  return db(steps)
    .join(schemes, "schemes.id", "=", "scheme_id")
    .select("steps.id", "scheme_name", "step_number", "instructions")
    .where({ scheme_id: id });
}

/* add(scheme):
    Expects a scheme object.
    Inserts scheme into the database.
    Resolves to the newly inserted scheme, including id.
 */
async function add(scheme) {
  try {
    const newSchemeId = await db(schemes).insert(scheme);
    console.log(newSchemeId);

    return findById(newSchemeId[0]);
  } catch (error) {
    return error;
  }
}

/* update(changes, id):
    Expects a changes object and an id.
    Updates the scheme with the given id.
    Resolves to the newly updated scheme object.
 */
async function update(changes, id) {
  try {
    await db(schemes)
      .update(changes)
      .where({ id });
    return findById(id);
  } catch (error) {
    return error;
  }
}

/* remove(id):
    Removes the scheme object with the provided id.
    Resolves to the removed scheme
    Resolves to null on an invalid id.
    */
function remove(id) {
  const removalPromise = new Promise(function(resolve, reject) {
    async function removal() {
      try {
        const schemeToDelete = await findById(id);
        if (schemeToDelete) {
          await db(schemes)
            .where({ id })
            .del();
          resolve(schemeToDelete);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    }
    removal();
  });
  return removalPromise;
}

/* 
addStep(step, scheme_id)
: This method expects a step object and a scheme id. 
It inserts the new step into the database, correctly linking it to the intended scheme.
*/
async function addStep(step, scheme_id) {
    const newStep = {...step, scheme_id};
    try {
        const newStepId = await db(steps).insert(newStep);
        return db(steps).where({id:newStepId[0]}).first();
    } catch (error) {
        return error
    }
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
  addStep
};
