const MongoClient = require('mongodb').MongoClient;
  const url = 'mongodb://127.0.0.1:27017'
  const dbName = 'local'
  let db;
  let processCollection;
  let elementCollection;
  let ObjectId = require('mongodb').ObjectID;

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
  
    // Storing a reference to the database so you can use it later
    db = client.db(dbName);
    processCollection = db.collection('Process');
    elementCollection = db.collection('Elements');
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`)
})
module.exports.saveProcess = async (data) => {
  try {
    let result = await processCollection.insertOne(data.Process);
    let processId = result.insertedId;
    console.log("ProcessId :", processId);

    data.Elements.forEach(async element => {

      /** Insert Element in Element Collection */
      const elementData = await elementCollection.insertOne(element);
      let elementId = elementData.insertedId;

      /** Update Process ID against Element */
      await  elementCollection.updateOne(
        { _id: elementId },
        { 
          $set: {
            ProcessId: processId
          }
        }
     )
    });
    
    return result;
  } catch (error) {
    console.error(error);
  } 
} 
  
  module.exports.updateProcess = async (data) => {
    try {
      console.log("Process Id: ", data.Process._id);
      let processId = data.Process._id;
        let result = await processCollection.updateOne(
          {_id: ObjectId(data.Process._id)},
          {
            $set: {
              Name: data.Process.Name
            }
          }
          );

      data.Elements.forEach(async element => {

        console.log("Element Id: ", element._id);

        if(element._id){
          console.log(`Update against ${element._id}`);

          /** Update against Element */
          await  elementCollection.updateOne(
            { _id: ObjectId(element._id) },
            { 
              $set: {
                Name: element.Name,
                Type: element.Type,
                Height: element.Height,
                Width: element.Width,
                Value: element.Value,
                X: element.X,
                Y: element.Y,
                ProcessId: ObjectId(processId)
              }
            }
          )
        }else{
          console.log(`Insert Element against ${processId}`);
          /** Insert Element in Element Collection */
          const elementData = await elementCollection.insertOne(element);
          let elementId = elementData.insertedId;

          /** Update Process ID against Element */
          await  elementCollection.updateOne(
            { _id: elementId },
            { 
              $set: {
                ProcessId: ObjectId(processId)
              }
            }
          )
        }
 
      });
      
      return result;
    } catch (error) {
      console.error(error);
    } 
}

module.exports.getProcess = async (id) => {
  try {
    console.log("Id :", id)

    let process = await processCollection.find({ _id : ObjectId(id)}).toArray();
    let elements = await elementCollection.find({ ProcessId: ObjectId(id) }).toArray();
    console.log("Id :", id)

    return {
      Process : process,
      Elements : elements
    };
  } catch (error) {
    console.error(error);
  }  
}
module.exports.getAllProcess = async () => {
  try {
    let result = await processCollection.find().toArray();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }  
}