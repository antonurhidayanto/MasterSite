import { Input, Select } from 'globalUtils/components';
import { ApiDataResponse ,restAPI } from 'globalUtils/utils';
import { form } from 'motion/react-client';
import { useState, useEffect } from 'react';

interface FormComponentProps {
  data: any;
  isEdit: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  // provinceId: number,
  onChange?: (data: any) => void;
}


const FormComponent: React.FC<FormComponentProps> = ({ data, isEdit, onSubmit,onChange }) => {
    const [formData, setFormData] = useState({
      client_name: '',
      site_name: '',
      site_id: 0,
      site_code: '',
      site_street: '',
      site_google_link: '',
      village_id: '',
      site_phone_number: 0,
      client_id: 0,
      province_id: data.province_id,
      city_id: 0
    });
    const [cityOptions, setCityOptions] = useState<{ value: any; label: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
  
    const handleChange = (event) => {
      console.log("Before setFormData:", formData);  // Cek nilai sebelum diubah
  setFormData({ ...formData, [event.target.name]: event.target.value });
  console.log("After setFormData:", formData);
    };
  
    const handleCityChange = (value) => {
      setFormData({ ...formData, city_id: value });
    };
  
    const fetchCityOptions = async () => {
      try {
        const response = await restAPI({
          url: `/master/site/v1/lov/cities?province_id=${formData.province_id}`,
          method: 'GET',
          domain: 'localhost',
          client: '1',
        });
        // const cityOptions = response.data.map((city) => ({
        //   value: city.city_id,
        //   label: city.city_name,
        // }));
        // setCityOptions(cityOptions);
        // setSelectedCity(cityOptions.find((city) => city.value === formData.city_id).value);

        const cityOptions = response.data.map((city) => ({
          value: city.city_id,
          label: city.city_name,
        }));
        setCityOptions(cityOptions);
        setSelectedCity(cityOptions.find((city) => city.value === formData.city_id)?.value ?? '');
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      if (formData.province_id) {
        fetchCityOptions();
      }
    }, [formData.province_id]);

    useEffect(() => {
      setFormData(data);
    }, [data]);

  
    useEffect(() => {
      if (onChange) {
        onChange(formData);
      }
    }, [formData, onChange]);

    useEffect(() => {
      if (cityOptions.length > 0) {
        setSelectedCity(cityOptions.find((city) => city.value === formData.city_id).value);
      }
    }, [cityOptions, formData.city_id]);
  
    return (
      <form onSubmit={(e) => { onSubmit(e); }} className='w-full flex'>
        <div className='w-full gap-2'>
          <div className='flex justify-between gap-3 my-3'>
            <Input name="client_name" label="Client Name" value={formData.client_name}  onChange={handleChange} disabled={!isEdit} />
            {/* <Input type="text" label="Site Id" value={formData.site_id} onChange={handleChange} disabled={!isEdit}/> */}
          </div>
          <div className='flex justify-between gap-3 my-3'>
            {cityOptions.length > 0 && (
              <Select
                label={"City"}
                placeholder='test'
                value={selectedCity}
                onValueChange={(e) => {
                  if (e) {
                    const selectedOption = cityOptions.find((option) => option.value === e);
                    if (selectedOption) {
                      setSelectedCity(selectedOption.value);
                      setFormData({ ...formData, city_id: selectedOption.value });
                    }
                  }
                }}
                handleClear={isEdit ? (e) => setSelectedCity('') : () => {}}
                disabled={isEdit ? false : true}
              >
                {cityOptions.map((city) => (
                  <Select.Item key={city.value} value={city.value}>
                    {city.label}
                  </Select.Item>
                ))}
              </Select>
            )}
            <Input type="text" name="site_name" label="Site Name" value={formData.site_name} onChange={handleChange} disabled={!isEdit} />
          </div>
          <div className='flex justify-between gap-3 my-3'>
            <Input type="text" label="Site Google Link" value={formData.site_google_link} onChange={handleChange} disabled={!isEdit} />
            <Input type="text" name="site_code" label="Site Code" value={formData.site_code} onChange={handleChange} disabled={!isEdit} />
          </div>
          <div className='flex justify-between gap-3 my-3'>
            <Input type="text" label="Site Phone Number" value={formData.site_phone_number} onChange={handleChange} disabled={!isEdit} />
            <Input type="text" label="Site Street" value={formData.site_street} onChange={handleChange} disabled={!isEdit} />
          </div>
        </div>
      </form>
    );
  };

export default FormComponent;