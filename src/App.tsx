import { useEffect, useState } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type Item = {
  id: string;
  content: string;
};

const getItems = (count: number) =>
  Array.from({ length: count }, (_, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  background: isDragging ? "lightgreen" : "grey",

  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  overflow: "auto",
});

function App() {
  const [stateItems, setStateItems] = useState<Item[]>([]);

  useEffect(() => {
    setStateItems(getItems(6));
  }, []);

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    const items: any = reorder(
      stateItems,
      result.source.index,
      result.destination.index,
    );

    setStateItems(items);
  }

  return (
    <>
      <pre style={{ textAlign: "left" }}>
        {JSON.stringify(stateItems, null, 2)}
      </pre>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"droppable"} direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {stateItems.map((item: Item, index: number) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default App;
