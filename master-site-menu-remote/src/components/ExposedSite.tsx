import { ColumnDef } from "@tanstack/react-table"
import { DataTable, Button, ActionDropdown,Select,ClearableInput,Dialog,Input,DialogConfirm , BaseAlert } from "globalUtils/components"
import { restAPI, ApiDataResponse } from "globalUtils/utils"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useToast, useAlertStatus } from 'globalUtils/hooks';
import { p, s } from "motion/react-client"
export type Column = {
  clientName: string
  siteId: string
  siteName: string
  city: string
  googleMapsLink: string
  siteCode: string,
  action: string
}

interface SiteData {
  site_name: string;
  site_code: string;
  city_name: string;
  site_google_link: string;
}



const ExposedSite = () => {

  
  const { toast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [data, setData] = useState<SiteData[]>([]);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Column | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [tableConfig, setTableConfig] = useState<{ rowPerPage: number; pageNumber: number }>({
    rowPerPage: 10,
    pageNumber: 1,
  });
  const [formData, setFormData] = useState({
    client_name: '',
    site_name: '',
    site_id: 0,
    site_code: '',
    site_street: '',
    site_google_link: '',
    site_phone_number: '',
    client_id: 0,
    province_id: 0,
    country_id: 0,
    city_id: 0,
    district_id: 0,
    village_id: 0
  });
  const [countryOptions, setCountryOptions] = useState<any[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [districtOptions, setDistrictOptions] = useState<any[]>([]);
  const [villageOptions, setVillageOptions] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDistrict,setSelectedDistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')
  const [provinceId, setProvinceId] = useState(0)
  const [cityId, setCityId] = useState(0)

  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState('');
  const [isAddSite, setIsAddSite] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);

  const [mockInput, setMockInput] = useState('');
  const {open, setOpen, alertStatus, setAlertStatus} = useAlertStatus()



  const columns: ColumnDef<Column>[] = [
    {
      accessorKey: "client_name",
      header: "Client Name",
    },
    {
      accessorKey: "site_id",
      header: "Site Id",
    },
    {
      accessorKey: "site_name",
      header: "Site Name",
    },
    {
      accessorKey:'city_name',
      header:'City'
    },
    {
      accessorKey:'site_google_link',
      header:'Site Google Link'
    },
    {
      accessorKey:'site_code',
      header:'Site Code'
    },
    {
      accessorKey:'action',
      header:'Action',
      cell:({row}) => {
        return (
          <ActionDropdown
              className="cursor-pointer"
                onView={() => handleView(row.original)}
                onEdit={() => handleEdit(row.original)}
                onDelete={() => handleDelete(row.original)}
                disableMap={{
                  view: false,
                  edit: false,
                  delete: false,
                }}
              />
        )
      }
    }
  ]

  
  const handleCloseModal = () => {
    setOpenDialog(false);
    setIsEdit(false);
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setSelectedProvince('');
    setSelectedCountry('');
  };
  
  const handleAddSite = () => {
    setIsAddSiteOpen(true);
    setIsAddSite(true); 
    setIsEdit(false); 
    setOpenDialog(true);
  
    setSelectedRow(null);
    setFormData({
      client_name: '',
      site_id: 0,
      site_name: '',
      site_code: '',
      site_street: '',
      site_google_link: '',
      village_id: 0,
      site_phone_number: '',
      client_id: 0,
      province_id: 0,
      country_id: 0,
      city_id: 0,
      district_id: 0
    });
  
    setSelectedCountry(null);
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedVillage(null);
  
    setCountryOptions([]);
    setProvinceOptions([]);
    setCityOptions([]);
    setDistrictOptions([]);
    setVillageOptions([]);

    fetchCountryOptions();
  };
  

  const handleView = (row: any) => {
    console.log('handleView dijalankan');
    console.log("View", row);
    setSelectedRow(row);
    setFormData({
      client_name: row.client_name || '',
      site_id: row.site_id || 0,
      site_name: row.site_name || '',
      site_code: row.site_code || '',
      site_street: row.site_street || '',
      site_google_link: row.site_google_link || '',
      village_id: row.village_id || 0,
      site_phone_number: row.site_phone_number || '',
      client_id: row.client_id || 0,
      province_id: row.province_id || 0,
      country_id: row.country_id || 0,
      city_id: row.city_id || 0,
      district_id: row.district_id || 0
    });
    setIsEdit(false);
    setIsAddSite(false);
    setOpenDialog(true);
  
    
    const countryOption = countryOptions.find((option) => option.value === row.country_id);
    if (countryOption) {
      setSelectedCountry(countryOption);
    }
  
   
    fetchProvinceOptions(row.country_id).then(() => {
      setProvinceOptions((prevProvinceOptions) => {
        const provinceOption = prevProvinceOptions.find((option) => option.value === row.province_id);
        if (provinceOption) {
          setSelectedProvince(provinceOption);
        }
        return prevProvinceOptions;
      });
    });
    fetchCityOptions(row.province_id).then(() => {
      setCityOptions((prevCityOptions) => {
        const cityOption = prevCityOptions.find((option) => option.value === row.city_id);
        if (cityOption) {
          setSelectedCity(cityOption);
        }
        return prevCityOptions;
      });
    });

    fetchDistrictOptions(row.city_id).then(() => {
      setDistrictOptions((prevDistrictOptions) => {
        const districtOption = prevDistrictOptions.find((option) => option.value === row.district_id);
        if (districtOption) {
          setSelectedDistrict(districtOption);
        }
        return prevDistrictOptions;
      });
    })

    fetchVillageOptions(row.district_id).then(() => {
      setVillageOptions((prevVillageOptions) => {
        const villageOption = prevVillageOptions.find((option) => option.value === row.village_id);
        if (villageOption) {
          setSelectedVillage(villageOption);
        }
        return prevVillageOptions;
      });
    })
    setIsAddSiteOpen(true);
  };
  
  const handleEdit = (row: any) => {
    console.log('handleEdit dijalankan');
    console.log("Edit");
    if (row) {
      setSelectedRow(row);
      setFormData({
        client_name: row.client_name || '',
        site_name: row.site_name || '',
        site_id: row.site_id || 0,
        site_code: row.site_code || '',
        site_street: row.site_street || '',
        site_google_link: row.site_google_link || '',
        village_id: row.village_id || '',
        site_phone_number: row.site_phone_number || '',
        client_id: row.client_id || 0,
        province_id: row.province_id || 0,
        country_id: row.country_id || 0,
        city_id: row.city_id || 0,
        district_id: row.district_id || 0
      });
      setIsEdit(true);
      setIsAddSite(false);
      setOpenDialog(true);
      setIsAddSiteOpen(true); 
  
      const countryOption = countryOptions.find((option) => option.value === row.country_id);
      if (countryOption) {
        setSelectedCountry(countryOption);
      }

      fetchProvinceOptions(row.country_id).then(() => {
        setProvinceOptions((prevProvinceOptions) => {
          const provinceOption = prevProvinceOptions.find((option) => option.value === row.province_id);
          if (provinceOption) {
            setSelectedProvince(provinceOption);
          }
          return prevProvinceOptions;
        });
      });
      fetchCityOptions(row.province_id).then(() => {
        setCityOptions((prevCityOptions) => {
          const cityOption = prevCityOptions.find((option) => option.value === row.city_id);
          if (cityOption) {
            setSelectedCity(cityOption);
          }
          return prevCityOptions;
        });
      });

      fetchDistrictOptions(row.city_id).then(() => {
        setDistrictOptions((prevDistrictOptions) => {
          const districtOption = prevDistrictOptions.find((option) => option.value === row.district_id);
          if (districtOption) {
            setSelectedDistrict(districtOption);
          }
          return prevDistrictOptions;
        });
      })

      fetchVillageOptions(row.district_id).then(() => {
        setVillageOptions((prevVillageOptions) => {
          const villageOption = prevVillageOptions.find((option) => option.value === row.village_id);
          if (villageOption) {
            setSelectedVillage(villageOption);
          }
          return prevVillageOptions;
        });
      })
      
    }
  };

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log("Submitting FormData:", formData);
  //   if (!formData || !formData.site_name || !formData.site_code) {
  //     console.error("Form data is incomplete:", formData);
  //     return;
  //   }
  //   if(isAddSite){
  //     try {
  //       const response = await restAPI<ApiDataResponse<any>>({
  //         url: `/master/site/v1/sites`,
  //         method: 'POST',
  //         domain: 'localhost',
  //         client: '1',
  //         data: {
  //           code: formData.site_code || '',
  //           name: formData.site_name || '',
  //           street: formData.site_street || '',
  //           google_link: formData.site_google_link || '',
  //           village_id: formData.village_id || 0,
  //           phone_number: formData.site_phone_number || '',
  //         }
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }else{
  //       try {
  //         const response = await restAPI<ApiDataResponse<any>>({
  //           url: `/master/site/v1/sites`,
  //           method: 'POST',
  //           domain: 'localhost',
  //           client: '1',
  //           data: {
  //             code: formData.site_code || '',
  //             name: formData.site_name || '',
  //             street: formData.site_street || '',
  //             google_link: formData.site_google_link || '',
  //             village_id: formData.village_id || 0,
  //             phone_number: formData.site_phone_number || '',
  //           }
  //         });
  //         console.log(response);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  // }

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   console.log("Submitting FormData:", formData);

  //   // Logika untuk mengecek perubahan data
  //     if (!formData || !formData.site_name || !formData.site_id) {
  //       console.error("Form data is incomplete:", formData);
  //       return;
  //     }
  //     try {
  //       const data = {
  //         id: formData.site_id || 0,
  //         code: formData.site_code || 0,
  //         name: formData.site_name || '',
  //         street: formData.site_street || '',
  //         google_link: formData.site_google_link || '',
  //         village_id: formData.village_id || 0,
  //         phone_number: formData.site_phone_number || '',
  //       };
    
  //       const response = await restAPI<ApiDataResponse<any>>({
  //         url: '/master/site/v1/sites',
  //         method: 'PUT',
  //         domain: 'localhost',
  //         client: '1',
  //         data,
  //       });
  
  //       console.log("Response data:", response);
  //       if (response.status === 200) {
  //         toast({
  //           title: 'Update Berhasil',
  //           message: 'Data berhasil diupdate',
  //           type: 'success',
  //           duration: 3000,
  //         });
  //         handleCloseModal();
  //       }
  //       fetchData(); // Panggil fungsi fetchData untuk mengambil data yang telah diperbarui
  //     } catch (error) {
  //       console.error("Error during form submission:", error);
  //     }
  // };
  

  // const handleError = () => {
  //   setOpen(true); // open the base alert
  //   setAlertStatus({
  //     title: "Error",
  //     content: "Something went wrong"
  //   });
  // }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting FormData:", formData);
  
    // if (!formData || !formData.site_name || !formData.site_code || !formData.site_phone_number || !formData.site_street || !formData.site_google_link || !formData.client_id || !formData.province_id || !formData.city_id || !formData.district_id || !formData.village_id) {
    //   setError("Form data is incomplete!");
    //   return;
    // }
    const errors: any = {};
    if (!formData) {  
        errors.formData = "This field is required";
    }
    if (!formData.site_name) {
      errors.site_name = "This field is required";
    }
  
    if (!formData.site_code) {
      errors.site_code = "This field is required";
    }
  
    if (!formData.site_phone_number) {
      errors.site_phone_number = "This field is required";
    }
  
    if (!formData.site_street) {
      errors.site_street = "This field is required";
    }
  
    if (!formData.site_google_link) {
      errors.site_google_link = "This field is required";
    }
  
    if (!formData.client_id) {
      errors.client_id = "This field is required";
    }
  
    if (!formData.province_id) {
      errors.province_id = "This field is required";
    }
  
    if (!formData.city_id) {
      errors.city_id = "This field is required";
    }
  
    if (!formData.district_id) {
      errors.district_id = "This field is required";
    }
  
    if (!formData.village_id) {
      errors.village_id = "This field is required";
    }
    
    try {
      if (isAddSite) {
        const data = {
          "code": formData.site_code,
          "name": formData.site_name,
          "street": formData.site_street,
          "google_link": formData.site_google_link,
          "village_id": formData.village_id,
          "phone_number": formData.site_phone_number,
        }

        const response = await restAPI<ApiDataResponse<any>>({
          url: '/master/site/v1/sites',
          method: 'POST',
          domain: 'localhost',
          client: '1',
          data : data,
        });
        
        console.log("Response data Add:", response);
        setFormData(response)
        if (response.status === 200) {
          toast({
            title: 'Add Site Berhasil',
            message: 'Data berhasil ditambahkan',
            type: 'success',
            duration: 10000,
          });
          handleCloseModal();
          fetchData();
        }else {
          if (response.status === 400) {
            setOpen(true);
            setAlertStatus({
              title: "Error",
              content: response.message
            })
          }
          // handleCloseModal();
        }
      } else {
        const data = {
          "id": formData.site_id,
          "code": formData.site_code,
          "name": formData.site_name,
          "street": formData.site_street,
          "google_link": formData.site_google_link,
          "village_id": formData.village_id,
          "phone_number": formData.site_phone_number
        };
        
        const response = await restAPI<ApiDataResponse<any>>({
          url: '/master/site/v1/sites',
          method: 'PUT',
          domain: 'localhost',
          client: '1',
          data,
        });

  
        console.log("Response data Update:", response);
        if (response.status === 200) {
          toast({
            title: 'Update Berhasil',
            message: 'Data berhasil diupdate',
            type: 'success',
            duration: 10000,
          });

          handleCloseModal();
          // setData(data);
          fetchData();
        }else {
          if (response.status === 400) {
            setOpen(true);
            setAlertStatus({
              title: "Error",
              content: response.message
            })
            handleCloseModal();
          }
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      
    }
  };
  
  const handleDelete = async (row) => {
    setOpenDeleteDialog(true);
    setSelectedRow(row);
  };

  const onDeleteProceed = async (site_id) => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/sites/${site_id}`,
        method: 'DELETE',
        domain: 'localhost',
        client: '1',
      });
      console.log("Response data Delete:", response);
      if (response.status === 200) {
        toast({
          title: 'Delete Berhasil',
          message: 'Data berhasil dihapus',
          type: 'success',
          duration: 10000,
        });
      }
      setOpenDeleteDialog(false);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  

  useEffect(() => {
    if(selectedRow){
      console.log("selectedRow", selectedRow)
    }
  },[selectedRow])

  useEffect(() => {
    setRowCount(data.length);
  }, [data]);

  const filteredData = data.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.site_name.toLowerCase().includes(searchTerm) ||
      item.site_code.toLowerCase().includes(searchTerm) ||
      item.city_name.toLowerCase().includes(searchTerm) ||
      item.site_google_link.toLowerCase().includes(searchTerm)
    );
  });
const handleFilterChange = (event: any) => {
  const { name, value } = event;
  
  switch (name) {
    case 'country_id':
      setSelectedCountry(value);
      fetchProvinceOptions(value);
      // setCountryId(value); 
      const filteredData = data.filter((item) => item.country_id === value);
      setData(filteredData);
      break;
    case 'province_id':
      setSelectedProvince(value);
      // setProvinceId(value);
      fetchCityOptions(value);
      const filteredDataProvince = data.filter((item) => item.province_id === value);
      setData(filteredDataProvince);
      break;
    case 'city_id':
      setSelectedCity(value);
      // setCityId(value);
      fetchDistrictOptions(value);
      const filteredDataCity = data.filter((item) => item.city_id === value);
      setData(filteredDataCity);
      break;
    case 'district_id':
      setSelectedDistrict(value);
      fetchVillageOptions(value);
      const filteredDataDistrict = data.filter((item) => item.district_id === value);
      setData(filteredDataDistrict);
      break;
    case 'village_id':
      setSelectedVillage(value);
      const filteredDataVillage = data.filter((item) => item.village_id === value);
      setData(filteredDataVillage);
      break;
    default:
      break;
    }
};
  

  const fetchData = async () => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/sites?page_number=${tableConfig.pageNumber}&page_size=${tableConfig.rowPerPage}&search=0&company_id=0&province_id=${provinceId}&city_id=${cityId}&district_id=0&village_id=0`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      })
      console.log("responseSites", response)
      setData(response.data)
      console.log("Data yang di-update:", response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCountryOptions = async () => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/countries`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const countryOptions = response.data.map((country) => ({
        value: country.country_id,
        label: country.country_name,
      }));
      setCountryOptions(countryOptions);
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchProvinceOptions = async (countryId: any) => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/provinces?country_id=${countryId}`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const provinceOptions = response.data.map((province) => ({
        value: province.province_id,
        label: province.province_name,
      }));
      console.log("responseProvince", response)
      setProvinceOptions(provinceOptions)
      
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCityOptions = async (provinceId: any) => {
    console.log('fetchCityOptions dijalankan');
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/cities?province_id=${provinceId}`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const cityOptions = response.data.map((city) => ({
        value: city.city_id,
        label: city.city_name,
      }));
      console.log('responseCity:', response.data);
      setCityOptions(cityOptions);
    } catch (error) {
      console.error(error);

    }

  };

  const fetchDistrictOptions = async (cityId: any) => {
    console.log('fetchCDistrictOptions dijalankan');
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/districts?city_id=${cityId}`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const districtOptions = response.data.map((district) => ({
        value: district.district_id,
        label: district.district_name,
      }));
      console.log("responseDistrict", response.data)
      setDistrictOptions(districtOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVillageOptions = async (districtId: any) => {
    try {
      const response = await restAPI<ApiDataResponse<any>>({
        url: `/master/site/v1/lov/villages?district_id=${districtId}`,
        method: 'GET',
        domain: 'localhost',
        client: '1',
      });
      const villageOptions = response.data.map((village) => ({
        value: village.village_id,
        label: village.village_name,
      }));
      setVillageOptions(villageOptions);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData()
    fetchCountryOptions()
  },[tableConfig])

  useEffect(() => {
    console.log('FormData after update:', formData);
  }, [formData]);
  
  const isViewMode = !isEdit && !isAddSite;

  return (
    <div className="mx-5 py-10">
      <div className="mb-10 flex">
        <div className="flex w-full items-center justify-end gap-2">
            <div className="flex flex-col justify-end gap-2 w-1/5">
            <Select
              placeholder="Country"
              value={selectedCountry}
              onValueChange={(value) => handleFilterChange({ name: 'country_id', value })}
              handleClear={(value) => {
                fetchData(),
                setSelectedCountry('')
                setSelectedDistrict('')
                setSelectedVillage('')
                setSelectedProvince('')
                setSelectedCity('')
              }}
              name="country_id"
            >
              {countryOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
            <Select
              placeholder="Province"
              value={selectedProvince}
              onValueChange={(value) => handleFilterChange({ name: 'province_id', value })}
              handleClear={(value) => {
                fetchData(),
                setSelectedProvince('')
                setSelectedCity('')
                setSelectedDistrict('')
                setSelectedVillage('')
              }}
              name="province_id"
            >
              {provinceOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
            </div>
            <div className="flex flex-col justify-end gap-2 w-1/5">
            <Select
              placeholder="City"
              value={selectedCity}
              onValueChange={(value) => handleFilterChange({ name: 'city_id', value })}
              handleClear={(value) => {
                fetchData(),
                setCityId(0),
                setSelectedProvince('')
                setSelectedCountry('')
                setSelectedCity('')
                setSelectedDistrict('')
                setSelectedVillage('')
              }}
              name="city_id"
            >
              {cityOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
            <Select
            placeholder="District"
            value={selectedDistrict}
            onValueChange={(value) => handleFilterChange({ name: 'district_id', value })}
            handleClear={(value) => {
              fetchData(),
              setSelectedDistrict('')
              setSelectedVillage('')
            }}
            name="district_id"
          >
            {districtOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select>
            </div>
            <div className="flex flex-col justify-end gap-2 w-1/5">
            <Select
              placeholder="Village"
              value={selectedVillage}
              onValueChange={(value) => handleFilterChange({ name: 'village_id', value })}
              handleClear={(value) => {
                fetchData(),
                setSelectedVillage('')
              }}
              name="village_id"
            >
              {villageOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select>
            <ClearableInput
              label='Search'
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
            </div>
        </div>
      </div>
      <div className="mb-10 flex-col justify-start">
              <Button variant={"secondary"} onClick={handleAddSite}>Add Site</Button>
        </div>
     <DataTable 
     className="max-w-screen-xl" 
     columns={columns} 
     data={filteredData} 
     showFooter={true} 
     rowCount={rowCount} 
     tableConfig={setTableConfig}
     /> 
        <Dialog open={isOpenDialog} setOpen={setOpenDialog} title={isAddSite ? "Add Site" : (isEdit ? (selectedRow ? "Edit Site" : "View Site") : "View Site")} description='Form Input'>
            <Dialog.Fill>
              <div className="flex flex-col">
                <div className="flex gap-2 my-2">
                  {/* {isEdit ? null : isAddSite ? null : ( */}
                    {/* <Input label="Client Name" name="client_name" value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value})}
                      disabled={isViewMode}
                    /> */}
                  {/* )} */}
                      <Input label="Site Name" value={formData.site_name || ''}
                      onChange={(e) => setFormData({ ...formData, site_name: e.target.value})}
                      disabled={isViewMode}
                      error={error.site_name}
                      />
                      <Input label="Site Code" name="site_code" value={formData.site_code || ''}
                    onChange={(e) => setFormData({ ...formData, site_code: e.target.value})}
                    disabled={isViewMode}
                    type="text"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                        setError('*Only numbers are allowed For Site Code*');
                      }else{
                        setError('');
                      }
                    }}
                    
                    />
                </div>
                <div className="flex gap-2 my-2">
                      {
                        countryOptions.length > 0 && (
                          <Select
                          placeholder='Country'
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
                        )
                      }

                      {
                        isAddSiteOpen && (
                          <Select
                          placeholder='Province'
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
                            if(isEdit){
                              setSelectedProvince(null);
                              setFormData({ ...formData, province_id: null });
                              setCityOptions([]);
                              setSelectedCity(null);
                              setDistrictOptions([]);
                              setSelectedDistrict(null);
                              setVillageOptions([]);
                              setSelectedVillage(null);
                            }else if(isAddSite){
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
                        )
                      }   
                </div> 
                <div className="flex gap-2 my-2"> 
                  {
                    isAddSiteOpen && (
                      <Select
                        placeholder='City'
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
                          if(isEdit){
                            setSelectedCity(null);
                            setFormData({ ...formData, city_id: null });
                            setDistrictOptions([]);
                            setSelectedDistrict(null);
                            setVillageOptions([]);
                            setSelectedVillage(null);
                          }else if(isAddSite){
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
                    )
                  }

                  {
                    isAddSiteOpen && (
                      <Select
                        placeholder='District'
                        value={selectedDistrict ? selectedDistrict.value : ''}
                        onValueChange={(e) => {
                          if (e) {
                            const selectedOptionDistrict = districtOptions.find((option) => option.value === e);
                            if(selectedOptionDistrict) {
                              setSelectedDistrict(selectedOptionDistrict);
                              setFormData({ ...formData, district_id: selectedOptionDistrict.value });
                              fetchVillageOptions(selectedOptionDistrict.value);
                            }
                          }
                        }}
                        handleClear={(e) => {
                          if(isEdit){
                            setSelectedDistrict(null);
                            setFormData({ ...formData, district_id: null });
                            setVillageOptions([]);
                            setSelectedVillage(null);
                          }else if(isAddSite){
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
                    )
                  }
                </div>
                <div className="flex gap-2 my-2">
                    {
                      isAddSiteOpen && (
                        <Select
                          placeholder='Village'
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
                            if(isEdit){
                              setSelectedVillage(null);
                              setVillageOptions([]);
                              setFormData({ ...formData, village_id: null });
                            }else if(isAddSite){
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
                        )
                    }

                      <Input label="Site Phone Number" name="site_phone_number" value={formData.site_phone_number || ''}
                        maxLength={15}
                        minLength={9}
                        pattern="^[0-9]*$"
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                            setError('*Only numbers are allowed For Phone Number');
                          }else{
                            setError('');
                          }
                        }}
                        onChange={(e) => {
                          const phoneNumber = e.target.value;
                          setFormData({ ...formData, site_phone_number: phoneNumber});
                        }}
                        disabled={isViewMode}
                        />    
                        
                </div>
                <div className="flex gap-2 my-2">
                  <Input label="Site Street" name="site_street" value={formData.site_street || ''}
                  onChange={(e) => setFormData({ ...formData, site_street: e.target.value})}
                  disabled={isViewMode}
                  />
                  <Input label="Site Google Link" name="site_google_link" value={formData.site_google_link || ''}
                  onChange={(e) => setFormData({ ...formData, site_google_link: e.target.value})}
                  disabled={isViewMode}
                  />
                </div>
                
                <div className="flex gap-2 justify-center my-5">
                <Button onClick={handleCloseModal}>Close</Button>
                {isEdit || isAddSite ? (
                  <Button onClick={handleSubmit}>{isEdit && selectedRow ? "Update" : "Add"}</Button>
                ) : null}
                </div>
              </div> 
              {error && <div className="text-xs flex flex-row items-center gap-2 text-red-500">{error}</div>}
            </Dialog.Fill>
        </Dialog>
        <DialogConfirm
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
        >
          <DialogConfirm.Title>Are you sure?</DialogConfirm.Title>
          <DialogConfirm.Content>
            <p>Are you sure you want to delete this data {selectedRow && (selectedRow as any).site_name}?</p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete your data.
            </p>
          </DialogConfirm.Content>
          <DialogConfirm.Footer
            onProceed={ () => {
              if (selectedRow && (selectedRow as any).site_id) {
                onDeleteProceed((selectedRow as any).site_id.toString());
              } else {
              console.error("selectedRow.site_id tidak terdefinisi");
            }
            }}
            proceedText="Delete"
            cancelText="Cancel"
          />
        </DialogConfirm>

        <BaseAlert 
            open={open} // from useAlertStatus
            setOpen={setOpen} // from useAlertStatus
            title={alertStatus.title} // from useAlertStatus.title
            content={alertStatus.content} // from useAlertStatus.content
        />

    </div>
  )
}

export default ExposedSite
