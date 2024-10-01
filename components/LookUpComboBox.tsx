import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetProps } from "@gorhom/bottom-sheet";
import { ThemedText } from "./ThemedText";

export type FieldResult = {
    text: string, value: string
};

export type LookUpComboBoxProps = BottomSheetProps & {
    dataList: FieldResult[]|null;  
    selectedValue: React.Dispatch<React.SetStateAction<FieldResult>>,
    sheetRef: React.RefObject<BottomSheet>
  }

export function LookUpComboBox({ dataList, selectedValue, sheetRef } : LookUpComboBoxProps ) {  
  
  const data = useMemo(
    () =>
        dataList,
    []
  );

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const selectedItem = (item: FieldResult) => {
    selectedValue(item);
    handleClosePress();
  };

  const renderItem = useCallback(
    ( item ) => (            
      <TouchableOpacity style={styles.itemContainer} onPress={() => selectedItem({text: item.item.text, value: item.item.value})}>
        <ThemedText style={{color: 'red'}}>{item.item.text}</ThemedText>
      </TouchableOpacity>
    ),
    []
  );

  return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        style={styles.BottomSheet}
      >
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i.value}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
  );
};

const styles = StyleSheet.create({
  BottomSheet: {
    zIndex: -1
  },
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});