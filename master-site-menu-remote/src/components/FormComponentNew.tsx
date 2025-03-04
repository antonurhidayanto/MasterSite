// FormComponent.tsx
import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from 'globalUtils/components';
import { ApiDataResponse, restAPI } from 'globalUtils/utils';
import { form } from 'motion/react-client';

interface FormComponentProps {
  data: any;
  isEdit: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FormComponentNew: React.FC<FormComponentProps> = ({
  data,
  isEdit,
  onSubmit,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState(data);
  const [cityOptions, setCityOptions] = useState<{ value: any; label: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [clientName, setClientName] = useState(formData.client_name);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCityChange = (value) => {
    setFormData({ ...formData, city_id: value });
  };

  const fetchCityOptions = async () => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/cities?province_id=${formData.province_id}`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const cityOptions = response.data.map((city) => ({
        value: city.city_id,
        label: city.city_name,
      }));
      setCityOptions(cityOptions);
      setSelectedCity(cityOptions.find((city) => city.value === formData.city_id).value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCityOptions();
  }, [formData.province_id]);

  useEffect(() => {
    if (cityOptions.length > 0) {
      setSelectedCity(cityOptions.find((city) => city.value === formData.city_id).value);
    }
  }, [cityOptions, formData.city_id]);

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-40 w-full flex items-center justify-center">
        <form onSubmit={onSubmit} className="w-full flex">
          <div className="w-full gap-2">
            <div className="flex justify-between gap-3 my-3">
              <Input
                name="client_name"
                label="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                disabled={!isEdit}
              />
              {/* <Input type="text" label="Site Id" value={formData.site_id} onChange={handleChange} disabled={!isEdit}/> */}
            </div>
            <div className="flex justify-between gap-3 my-3">
              {cityOptions.length > 0 && (
                <Select
                  label={"City"}
                  placeholder="test"
                  value={selectedCity}
                  onValueChange={(e) => {
                    if (e) {
                      const selectedOption = cityOptions.find(
                        (option) => option.value === e
                      );
                      if (selectedOption) {
                        setSelectedCity(selectedOption.value);
                        setFormData({
                          ...formData,
                          city_id: selectedOption.value,
                        });
                      }
                    }
                  }}
                  handleClear={isEdit ? (e) => setSelectedCity("") : () => {}}
                  disabled={isEdit ? false : true}
                >
                  {cityOptions.map((city) => (
                    <Select.Item key={city.value} value={city.value}>
                      {city.label}
                    </Select.Item>
                  ))}
                </Select>
              )}
              <Input
                type="text"
                label="Site Name"
                value={formData.site_name}
                onChange={handleChange}
                disabled={!isEdit}
              />
            </div>
            <div className="flex justify-between gap-3 my-3">
              <Input
                type="text"
                label="Site Google Link"
                value={formData.site_google_link}
                onChange={handleChange}
                disabled={!isEdit}
              />
              <Input
                type="text"
                label="Site Code"
                value={formData.site_code}
                onChange={handleChange}
                disabled={!isEdit}
              />
            </div>
            <div className="flex justify-between gap-3 my-3">
              <Input
                type="text"
                label="Site Phone Number"
                value={formData.site_phone_number}
                onChange={handleChange}
                disabled={!isEdit}
              />
              <Input
                type="text"
                label="Site Street"
                value={formData.site_street}
                onChange={handleChange}
                disabled={!isEdit}
              />
            </div>
          </div>
        </form>
        <Button variant="primary" type="submit" onClick={onClose}>Close</Button>
        <Button variant="primary" type="submit" onClick={onClose}>OK</Button>
      </div>
    </div>
  );
};

export default FormComponentNew;