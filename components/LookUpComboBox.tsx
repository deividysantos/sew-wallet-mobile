import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList, BottomSheetProps, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { ThemedText } from "./ThemedText";

export type FieldResult = {
    text: string, value: number
};

export type LookUpComboBoxProps = BottomSheetProps & {
    title?: string,
    dataList: FieldResult[]|null;  
    selectedValue: (e : FieldResult) => void,
    sheetRef: React.RefObject<BottomSheet>
  }

export function LookUpComboBox({ title, dataList, selectedValue, sheetRef } : LookUpComboBoxProps ) {  
  
  const data = useMemo(
    () =>
        dataList,
    []
  );

  const snapPoints = useMemo(() => ["40%","75%", "90%"], []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const selectedItem = (item: FieldResult) => {
    selectedValue(item);
    handleClosePress();
  };

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
        pressBehavior={"close"}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
			/>
		),
		[]
	);

  const renderItem = useCallback(
    ( item: { item: {text: string, value: number} } ) => (            
      <TouchableOpacity style={styles.itemContainer} onPress={() => selectedItem({text: item.item.text, value: item.item.value})}>
        <ThemedText style={{color: 'black'}}>{item.item.text}</ThemedText>
      </TouchableOpacity>
    ),
    []
  );

  return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
      >
        {title && 
          <ThemedText style={{marginHorizontal: 10, color: 'black'}} type="subtitle">{title}</ThemedText>
        }
        
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i.text}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </BottomSheet>
  );
};

const styles = StyleSheet.create({
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
    
  },
});