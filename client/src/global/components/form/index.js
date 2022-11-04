import BaseInput, { FormBaseInput } from "./BaseInput";
import CodeArea from "./CodeArea";
import AttributeMap from "./AttributeMap";
import DatePicker from "./DatePicker";
import FieldGroup from "./FieldGroup";
import GeneratedPasswordInput from "./GeneratedPasswordInput";
import Header from "./Header";
import Hidden from "./Hidden";
import Instructions from "./Instructions";
import MaskedTextInput from "./MaskedTextInput";
import NumberInput from "./NumberInput";
import Radios from "./Radios";
import Save from "./Save";
import SectionLabel from "./SectionLabel";
import Select from "./Select";
import setter from "./setter";
import Switch from "./Switch";
import { Toggle } from "./Switch/ToggleOnly";
import SwitchArray from "./SwitchArray";
import TextArea, { FormTextArea } from "./TextArea";
import TextInput from "./TextInput";
import TusUpload from "./TusUpload";
import Upload from "./Upload";
import CoverUploadPlaceholder from "./CoverUploadPlaceholder";
import InputError from "./InputError";
import Errorable from "./Errorable";
import Errors from "./Errors";
import Divider from "./Divider";
import Picker from "./Picker";
import Label from "./BaseLabel";
import FieldWrapper from "./FieldWrapper";
import { InputGroupPrimary, InputGroupSecondary } from "./InputGroup/styles";
import DrawerButtons from "./DrawerButtons";

export default {
  CoverUploadPlaceholder,
  InputError,
  Errors,
  Errorable,
  BaseInput,
  CodeArea,
  AttributeMap,
  DatePicker,
  FieldGroup,
  GeneratedPasswordInput,
  Header,
  Hidden,
  Instructions,
  MaskedTextInput,
  NumberInput,
  Radios,
  Save,
  SectionLabel,
  Select,
  setter,
  Switch,
  SwitchArray,
  TextArea,
  TextInput,
  TusUpload,
  Upload,
  Divider,
  Picker,
  Label,
  FieldWrapper,
  InputGroupPrimary,
  InputGroupSecondary,
  DrawerButtons
};

export const Unwrapped = {
  TextArea: FormTextArea,
  Input: FormBaseInput,
  Toggle
};
