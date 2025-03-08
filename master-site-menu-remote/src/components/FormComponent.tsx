import React, { useEffect, useState } from "react";
import { Select, Input, Button } from "globalUtils/components";

interface FormComponentProps {
  formData: any;
  setFormData: (data: any) => void;
  isViewMode: boolean;
  error: string;
  setError: (error: string) => void;
  countryOptions: any[];
  selectedCountry: any;
  setSelectedCountry: (country: any) => void;
  provinceOptions: any[];
  selectedProvince: any;
  setSelectedProvince: (province: any) => void;
  cityOptions: any[];
  selectedCity: any;
  setSelectedCity: (city: any) => void;
  districtOptions: any[];
  selectedDistrict: any;
  setSelectedDistrict: (district: any) => void;
  villageOptions: any[];
  selectedVillage: any;
  setSelectedVillage: (village: any) => void;
  fetchProvinceOptions: (countryId: any) => void;
  fetchCityOptions: (provinceId: any) => void;
  fetchDistrictOptions: (cityId: any) => void;
  fetchVillageOptions: (districtId: any) => void;
  handleCloseModal: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isEdit: boolean;
  isAddSite: boolean;
  selectedRow: any;
  setProvinceOptions: (options: any[]) => void;
  setCityOptions: (options: any[]) => void;
  setDistrictOptions: (options: any[]) => void;
  setVillageOptions: (options: any[]) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  formData,
  setFormData,
  isViewMode,
  error,
  setError,
  countryOptions,
  selectedCountry,
  setSelectedCountry,
  provinceOptions,
  selectedProvince,
  setSelectedProvince,
  cityOptions,
  selectedCity,
  setSelectedCity,
  districtOptions,
  selectedDistrict,
  setSelectedDistrict,
  villageOptions,
  selectedVillage,
  setSelectedVillage,
  fetchProvinceOptions,
  fetchCityOptions,
  fetchDistrictOptions,
  fetchVillageOptions,
  handleCloseModal,
  handleSubmit,
  isEdit,
  isAddSite,
  selectedRow,
  setProvinceOptions,
  setCityOptions,
  setDistrictOptions,
  setVillageOptions
}) => {

  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const requiredFields = [
      formData.site_name,
      formData.site_code,
      formData.site_phone_number,
      formData.site_street,
      formData.site_google_link,
      formData.country_id,
      formData.province_id,
      formData.city_id,
      formData.district_id,
      formData.village_id,
    ];

    return requiredFields.every((field) => field !== null && field !== undefined && field !== '');
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);


  return (
    <div className="flex flex-col">
      <div className="flex gap-2 my-2">
        <Input
          label="Site Name"
          value={formData.site_name || ''}
          onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
          disabled={isViewMode}
          error={error}
        />
        <Input
          label="Site Code"
          name="site_code"
          value={formData.site_code || ''}
          onChange={(e) => setFormData({ ...formData, site_code: e.target.value
          })}
          disabled={isEdit || isViewMode}
          type="text"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
              setError('*Only numbers are allowed For Site Code*');
            } else {
              setError('');
            }
          }}
        />
      </div>
      <div className="flex gap-2 my-2">
        {countryOptions.length > 0 && (
          <Select
            placeholder="Country"
            value={selectedCountry ? selectedCountry.value : ''}
            onValueChange={(e) => {
              if (e) {
                const selectedOption = countryOptions.find((option) => option.value === e);
                if (selectedOption) {
                  setSelectedCountry(selectedOption);
                  setFormData({ ...formData, country_id: selectedOption.value });
                  fetchProvinceOptions(selectedOption.value);
                }
              }
            }}
            handleClear={(e) => {
              if(isAddSite ){
                setSelectedCountry(null);
                setFormData({ ...formData, country_id: null });
                setProvinceOptions([]);
                setCityOptions([]);
                setDistrictOptions([]);
                setVillageOptions([]);
                setSelectedProvince(null);
                setSelectedCity(null);
                setSelectedDistrict(null);
                setSelectedVillage(null);
              }else if(isEdit){
                setSelectedCountry(null);
                setFormData({ ...formData, country_id: null });
                setProvinceOptions([]);
                setCityOptions([]);
                setDistrictOptions([]);
                setVillageOptions([]);
                setSelectedProvince(null);
                setSelectedCity(null);
                setSelectedDistrict(null);
                setSelectedVillage(null);
              }
            }}
            disabled={isViewMode}
          >
            {countryOptions.map((country) => (
              <Select.Item key={country.value} value={country.value}>
                {country.label}
              </Select.Item>
            ))}
          </Select>
        )}
        <Select
          placeholder="Province"
          value={selectedProvince ? selectedProvince.value : ''}
          onValueChange={(e) => {
            if (e) {
              const selectedOptionProvince = provinceOptions.find((option) => option.value === e);
              if (selectedOptionProvince) {
                setSelectedProvince(selectedOptionProvince);
                setFormData({ ...formData, province_id: selectedOptionProvince.value });
                fetchCityOptions(selectedOptionProvince.value);
              }
            }
          }}
          handleClear={(e) => {
            if (isEdit) {
              setSelectedProvince(0);
              setFormData({ ...formData, province_id: 0 });
              setCityOptions([]);
              setSelectedCity(null);
              setDistrictOptions([]);
              setSelectedDistrict(null);
              setVillageOptions([]);
              setSelectedVillage(null);
            } else if (isAddSite) {
              setSelectedProvince(null);
              setFormData({ ...formData, province_id: null });
              setCityOptions([]);
              setSelectedCity(null);
              setDistrictOptions([]);
              setSelectedDistrict(null);
              setVillageOptions([]);
              setSelectedVillage(null);
            }
          }}
          disabled={!selectedCountry || isViewMode}
        >
          {provinceOptions.map((province) => (
            <Select.Item key={province.value} value={province.value}>
              {province.label}
            </Select.Item>
          ))}
        </Select>
      </div>
      <div className="flex gap-2 my-2">
        <Select
          placeholder="City"
          value={selectedCity ? selectedCity.value : ''}
          onValueChange={(e) => {
            if (e) {
              const selectedOptionCity = cityOptions.find((option) => option.value === e);
              if (selectedOptionCity) {
                setSelectedCity(selectedOptionCity);
                setFormData({ ...formData, city_id: selectedOptionCity.value });
                fetchDistrictOptions(selectedOptionCity.value);
              }
            }
          }}
          handleClear={(e) => {
            if (isEdit) {
              setSelectedCity(null);
              setFormData({ ...formData, city_id: null });
              setDistrictOptions([]);
              setSelectedDistrict(null);
              setVillageOptions([]);
              setSelectedVillage(null);
            } else if (isAddSite) {
              setSelectedCity(null);
              setFormData({ ...formData, city_id: null });
              setDistrictOptions([]);
              setSelectedDistrict(null);
              setVillageOptions([]);
              setSelectedVillage(null);
            }
          }}
          disabled={!selectedProvince || isViewMode}
        >
          {cityOptions.map((city) => (
            <Select.Item key={city.value} value={city.value}>
              {city.label}
            </Select.Item>
          ))}
        </Select>
        <Select
          placeholder="District"
          value={selectedDistrict ? selectedDistrict.value : ''}
          onValueChange={(e) => {
            if (e) {
              const selectedOptionDistrict = districtOptions.find((option) => option.value === e);
              if (selectedOptionDistrict) {
                setSelectedDistrict(selectedOptionDistrict);
                setFormData({ ...formData, district_id: selectedOptionDistrict.value });
                fetchVillageOptions(selectedOptionDistrict.value);
              }
            }
          }}
          handleClear={(e) => {
            if (isEdit) {
              setSelectedDistrict(null);
              setFormData({ ...formData, district_id: null });
              setVillageOptions([]);
              setSelectedVillage(null);
            } else if (isAddSite) {
              setFormData({ ...formData, district_id: null });
              setVillageOptions([]);
              setSelectedVillage(null);
              setSelectedDistrict(null);
            }
          }}
          disabled={!selectedCity || isViewMode}
        >
          {districtOptions.map((district) => (
            <Select.Item key={district.value} value={district.value}>
              {district.label}
            </Select.Item>
          ))}
        </Select>
      </div>
      <div className="flex gap-2 my-2">
        <Select
          placeholder="Village"
          value={selectedVillage ? selectedVillage.value : ''}
          onValueChange={(e) => {
            if (e) {
              const selectedOptionVillage = villageOptions.find((option) => option.value === e);
              if (selectedOptionVillage) {
                setSelectedVillage(selectedOptionVillage);
                setFormData({ ...formData, village_id: selectedOptionVillage.value });
              }
            }
          }}
          handleClear={(e) => {
            if (isEdit) {
              setSelectedVillage(null);
              setVillageOptions([]);
              setFormData({ ...formData, village_id: null });
            } else if (isAddSite) {
              setSelectedVillage(null);
              setVillageOptions([]);
              setFormData({ ...formData, village_id: null });
            }
          }}
          disabled={!selectedDistrict || isViewMode}
        >
          {villageOptions.map((village) => (
            <Select.Item key={village.value} value={village.value}>
              {village.label}
            </Select.Item>
          ))}
        </Select>
        <Input
          label="Site Phone Number"
          name="site_phone_number"
          value={formData.site_phone_number || ''}
          maxLength={15}
          minLength={9}
          pattern="^[0-9]*$"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
              setError('*Only numbers are allowed For Phone Number');
            } else {
              setError('');
            }
          }}
          onChange={(e) => {
            const phoneNumber = e.target.value;

            if (phoneNumber.length > 0 && phoneNumber[0] !== '0') {
              setError('*Phone number must start with 0');
            }
            else if (/\s/.test(phoneNumber)) {
              setError('*Spaces are not allowed in Phone Number');
            }
            else if (!/^\d*$/.test(phoneNumber)) {
              setError('*Only numbers are allowed for Phone Number');
            }
            else if (phoneNumber.length < 9 || phoneNumber.length > 15) {
              setError('*Phone number must be between 9 and 15 characters');
            }
            else {
              setError('');
            }
            setFormData({ ...formData, site_phone_number: phoneNumber });
          }}
          disabled={isViewMode}
        />
      </div>
      <div className="flex gap-2 my-2">
        <Input
          label="Site Street"
          name="site_street"
          value={formData.site_street || ''}
          onChange={(e) => setFormData({ ...formData, site_street: e.target.value })}
          disabled={isViewMode}
        />
        <Input
          label="Site Google Link"
          name="site_google_link"
          value={formData.site_google_link || ''}
          onChange={(e) => setFormData({ ...formData, site_google_link: e.target.value })}
          disabled={isViewMode}
        />
      </div>
      <div className="flex gap-2 justify-center my-5">
        <Button onClick={handleCloseModal}>Close</Button>
        {isEdit || isAddSite ? (
          <Button onClick={handleSubmit} disabled={!isFormValid}>{isEdit && selectedRow ? "Update" : "Add"}</Button>
        ) : null}
      </div>
      {error && <div className="text-xs flex flex-row items-center gap-2 text-red-500">{error}</div>}
    </div>
  );
};

export default FormComponent;