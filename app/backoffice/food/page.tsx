"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import MyModal from "../components/MyModal";
import { time } from "console";

export default function Page() {
  const [foodTypeId, setFoodTypeId] = useState(0);
  const [foodTypes, setFoodTypes] = useState([]);
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);
  const [prices, setPrices] = useState(0);
  const [img, setImg] = useState("");
  const [myFile, setMyFile] = useState<File | null>(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchDataFoodTypes();
    fetchData();
  }, []);

  const fetchDataFoodTypes = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/foodtype/list");
      if (res.data.results.length > 0) {
        setFoodTypes(res.data.results);
        setFoodTypeId(res.data.results[0].id);
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  const handleSelectFile = (e: any) => {
    if (e.target.files.length > 0) {
      setMyFile(e.target.files[0]);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiServer + "/api/food/list");
      setFoods(res.data.results);
    } catch (e: any) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  const handleSave = async () => {
    try {
      const img = await handleUpload();
      const payLoad = {
        foodTypeId: foodTypeId,
        name: name,
        remark: remark,
        id: id,
        prices: prices,
        img: img,
      };
      const res = await axios.post(
        config.apiServer + "/api/food/create",
        payLoad
      );
      if (res.data.message === "success") {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
          text: res.data.message,
          timer: 1500,
        });
        fetchData();
        document.getElementById("modalFood_btnClose")?.click();
      }
    } catch (e: any) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      formData.append("file", myFile as Blob);

      const res = await axios.post(
        config.apiServer + "/api/food/upload",
        formData
      );
      return res.data.fileName;
    } catch (e: any) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: e.message,
      });
    }
  };

  return (
    <>
      <div className="mt-3 card">
        <div className="card-header">อาหาร</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalFood"
          >
            <i className="fas faplus me-2">เพิ่มรายการ</i>
          </button>
          <table className="table mt-3 table-bordered table-striped">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>ภาพ</th>
                <th style={{ width: "200px" }}>ประเภท</th>
                <th style={{ width: "200px" }}>ชื้อ</th>
                <th>หมายเหตุ</th>
                <th style={{ width: "100px" }}>ราคา</th>
                <th style={{ width: "100px" }}></th>
              </tr>
            </thead>
            <tbody>
              {foods.map((item: any) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={config.apiServer + "/uploads/" + item.img}
                      style={{ width: "100px" }}
                      alt={item.name}
                    />
                  </td>
                  <td>{item.foodType.name}</td>
                  <td>{item.name}</td>
                  <td>{item.prices}</td>
                  <td className="text-center">
                    <button className="btn btn-primary me-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-danger">
                      <i className="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MyModal id="modalFood" title="อาหาร">
        <div>ประภทอาการ</div>
        <select
          className="form-control"
          value={foodTypeId}
          onChange={(e) => setFoodTypeId(Number(e.target.value))}
        >
          {foodTypes.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="mt-3">ภาพ</div>
        <input
          type="file"
          className="form-control"
          value={img}
          onChange={(e) => handleSelectFile(e)}
        />
        <div className="mt-3">ชื่ออาหาร</div>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-3">หมายเหตุ</div>
        <input
          type="text"
          className="form-control"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <div className="mt-3">ราคา</div>
        <input
          type="text"
          className="form-control"
          value={prices}
          onChange={(e) => setPrices(parseInt(e.target.value))}
        />
        <button className="mt-3 btn btn-primary" onClick={handleSave}>
          <i className="fa fa-check me-2"></i>
          บันทึก
        </button>
      </MyModal>
    </>
  );
}
