import { useState } from 'react'
import {
  View,
  TextInput,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet
} from 'react-native'
import { useController } from 'react-hook-form'
import StyledText from './StyledText'
import ChevronDownSVG from '../img/ChevronDown'
import { theme } from '../theme'
import { COUNTRY_CODES } from '../utils/constants'

export default function PhoneInput ({
  label,
  control,
  name,
  placeholder,
  style,
  inputStyle
}) {
  const { field, fieldState } = useController({ control, name })

  const [selected, setSelected] = useState(COUNTRY_CODES[0])
  const [localNumber, setLocalNumber] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const handleNumberChange = (text) => {
    setLocalNumber(text)
    field.onChange('+' + selected.dialCode + text)
  }

  const handleSelectCountry = (country) => {
    setSelected(country)
    setModalVisible(false)
    field.onChange('+' + country.dialCode + localNumber)
  }

  const hasError = !!fieldState.error

  return (
    <View style={[styles.wrapper, style]}>
      <StyledText style={styles.floatingLabel}>{label}</StyledText>

      <View style={[styles.row, hasError && styles.rowError]}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.pickerSection}
          accessibilityLabel='Select country code'
          accessibilityRole='button'
          accessibilityHint='Opens a list of country dial codes'
        >
          <StyledText style={styles.flag}>{selected.flag}</StyledText>
          <StyledText style={styles.dialCode}>+{selected.dialCode}</StyledText>
          <ChevronDownSVG color={theme.colors.textSecondary} />
        </Pressable>

        <TextInput
          value={localNumber}
          onChangeText={handleNumberChange}
          placeholder={placeholder}
          placeholderTextColor='rgba(255,255,255,0.3)'
          keyboardType='phone-pad'
          autoCorrect={false}
          allowFontScaling
          style={[styles.numberInput, inputStyle]}
          accessibilityLabel={label}
          accessibilityHint='Enter the local phone number without country code'
        />
      </View>

      {fieldState.error && (
        <StyledText style={styles.errorText}>{fieldState.error.message}</StyledText>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)} accessibilityLabel='Close country picker'>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCard}>
          <FlatList
            data={COUNTRY_CODES}
            keyExtractor={(item) => item.iso}
            renderItem={({ item }) => {
              const isActive = item.iso === selected.iso
              return (
                <Pressable
                  onPress={() => handleSelectCountry(item)}
                  style={[styles.countryRow, isActive && styles.countryRowActive]}
                  accessibilityRole='button'
                  accessibilityLabel={`${item.name} +${item.dialCode}`}
                  accessibilityState={{ selected: isActive }}
                >
                  <StyledText style={styles.countryFlag}>{item.flag}</StyledText>
                  <StyledText style={[styles.countryName, isActive && styles.countryNameActive]}>
                    {item.name}
                  </StyledText>
                  <StyledText style={[styles.countryDial, isActive && styles.countryNameActive]}>
                    +{item.dialCode}
                  </StyledText>
                </Pressable>
              )
            }}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative'
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sub,
    zIndex: 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden'
  },
  rowError: {
    borderColor: theme.colors.danger
  },
  pickerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 10,
    paddingVertical: 18,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
    gap: 4
  },
  flag: {
    fontSize: theme.fontSizes.body,
    lineHeight: 20
  },
  dialCode: {
    fontSize: theme.fontSizes.sub,
    color: theme.colors.textSecondary
  },
  numberInput: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    paddingHorizontal: 12,
    paddingVertical: 18,
    color: theme.colors.textPrimary,
    letterSpacing: 0
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginTop: -4,
    marginBottom: 6,
    paddingHorizontal: 2
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modalCard: {
    backgroundColor: theme.colors.secondary,
    maxHeight: 320,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10
  },
  countryRowActive: {
    backgroundColor: 'rgba(221, 133, 31, 0.15)'
  },
  countryFlag: {
    fontSize: theme.fontSizes.body,
    lineHeight: 22
  },
  countryName: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary
  },
  countryNameActive: {
    color: '#dd851f'
  },
  countryDial: {
    fontSize: theme.fontSizes.sub,
    color: theme.colors.textSecondary
  }
})
