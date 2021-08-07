const items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: null, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" },
  { id: 8, seqId: 3, parent: 6, name: "control" },
];

const transformItems = (items) => {
  // Sort the array by parent then seqId, this will make it easier to process
  const sortedItems = items.sort(function (a, b) {
    return a.parent - b.parent || a.seqId - b.seqId;
  });

  /*
    Initialize two arrays:
    root items for those items without a parent, this
    will act as a queue and will make sure that
    the items without parent will be organized.
    and then the storage for the resulting list/array
  */

  let root = [];
  let finalItems = [];

  // loop through the sorted items array of objects
  for (let i = 0; i < sortedItems.length; i++) {
    // since the items are sorted, it lets us go through the list once
    if (sortedItems[i].parent === null) {
      // fill out the root array, adding a depth field of 0 (no parent)
      Object.assign(sortedItems[i], { depth: 0 });
      root.push(sortedItems[i]);
    } else {
      /*
        first item of root array is assumed as the parent of the next available item
        since the items are sorted.
      */
      try {
        if (sortedItems[i].parent === root[0].id) {
          /*
          add first item on root to resulting array
          add the current item immediately after
        */
          finalItems.push(...root.splice(0, 1));
          Object.assign(sortedItems[i], {
            depth: sortedItems[i - 1].depth + 1,
          });
          finalItems.push(sortedItems[i]);
        } else {
          // if parent of current sortedItem is not in root array, then look in finalItems array
          for (let j = 0; j < finalItems.length; j++) {
            if (sortedItems[i].parent === finalItems[j].id) {
              /*
              if parent is found, look for its last child before adding the current item
              if the current item has a sibling to the right, then it shouldn't be added immediate to the parent
            */
              let lastIndex = findLastChildInstance(sortedItems[i], finalItems);

              // if there is no other child, insert the current item to the right of the parent
              if (lastIndex < 0) {
                lastIndex = j + 1;
              }

              // assign depth
              Object.assign(sortedItems[i], {
                depth: finalItems[j].depth + 1,
              });

              // inert the item to the correct index, depending on if there are other children or not
              finalItems.splice(lastIndex, 0, sortedItems[i]);
              break;
            }
          }
        }
      } catch {
        console.log(JSON.stringify(sortedItems[i]) + " is invalid");
      }
    }
  }

  // add the remaining parent/root items
  if (root.length > 0) {
    finalItems.push(...root);
  }

  return finalItems;
};

// function to find last child instance to know where to put current item
const findLastChildInstance = (item, items) => {
  for (let index = items.length - 1; index > 0; index--) {
    if (items[index].parent === item.parent) {
      return index + 1;
    }
  }
  return -1;
};

console.log(transformItems(items));
