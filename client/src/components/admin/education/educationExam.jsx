import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  getBookletByTypeThunk,
  getBookletByIdThunk,
} from "../../../features/thunks/bookletThunk";

export default function EducationExam({ formData, handleChange }) {
  const dispatch = useDispatch();
  const [booklets, setBooklets] = useState({ teo: [], img: [] });
  const [selectedBooklets, setSelectedBooklets] = useState({
    teo: null,
    img: null,
  });

  // Kitapçıkları getir
  useEffect(() => {
    const fetchBooklets = async () => {
      try {
        const teo = await dispatch(getBookletByTypeThunk("teo")).unwrap();
        const img = await dispatch(getBookletByTypeThunk("img")).unwrap();
        setBooklets({ teo, img });
      } catch (err) {
        setBooklets({ teo: [], img: [] });
      }
    };
    fetchBooklets();
  }, [dispatch]);

  // Seçilen kitapçık detayını getir (teo/img)
  const fetchSelectedBooklet = useCallback(
    async (type, id) => {
      if (!id) {
        setSelectedBooklets((prev) => ({ ...prev, [type]: null }));
        return;
      }
      try {
        const booklet = await dispatch(getBookletByIdThunk(id)).unwrap();
        setSelectedBooklets((prev) => ({ ...prev, [type]: booklet }));
      } catch {
        setSelectedBooklets((prev) => ({ ...prev, [type]: null }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchSelectedBooklet("teo", formData.bookletId_teo);
  }, [formData.bookletId_teo, fetchSelectedBooklet]);

  useEffect(() => {
    fetchSelectedBooklet("img", formData.bookletId_img);
  }, [formData.bookletId_img, fetchSelectedBooklet]);

  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      {/* Ortak Alanlar */}
      <div className="mb-4">
        <label htmlFor="exam_name" className="form-label fw-semibold">
          Sınav Adı <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="exam_name"
          name="exam_name"
          value={formData.exam_name}
          onChange={handleChange}
          className="form-control form-control-lg shadow-sm"
          placeholder="Sınav adını girin"
          required
        />
      </div>

      {/* Teorik Alanlar */}
      <section className="mb-5 p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-3 text-primary fw-bold">Teorik Sınav Bilgileri</h5>

        <div className="row g-3 align-items-center mb-4">
          <label
            htmlFor="sure_teo"
            className="col-sm-4 col-form-label fw-semibold"
          >
            Teorik Süre (dk)
          </label>
          <div className="col-sm-8">
            <select
              id="sure_teo"
              name="sure_teo"
              value={formData.sure_teo}
              onChange={handleChange}
              className="form-select shadow-sm"
            >
              {[...Array(11).keys()]
                .map((i) => 5 + i)
                .concat([...Array(17).keys()].map((i) => 20 + i * 5))
                .map((value) => (
                  <option key={value} value={value}>
                    {value} dk
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-4">
          <label
            htmlFor="passing_score_teo"
            className="col-sm-4 col-form-label fw-semibold"
          >
            Geçme Notu
          </label>
          <div className="col-sm-8">
            <select
              id="passing_score_teo"
              name="passing_score_teo"
              value={formData.passing_score_teo}
              onChange={handleChange}
              className="form-select shadow-sm"
            >
              {[...Array(11).keys()]
                .map((i) => 50 + i * 5)
                .map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="bookletId_teo" className="form-label fw-semibold">
            Kitapçık Seçiniz
          </label>
          <select
            id="bookletId_teo"
            name="bookletId_teo"
            value={formData.bookletId_teo}
            onChange={handleChange}
            className="form-select shadow-sm"
          >
            <option value="">Seçiniz...</option>
            {booklets.teo.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {selectedBooklets.teo && (
          <div
            className="alert alert-info py-2 mt-2"
            role="alert"
            aria-label="Teorik kitapçık soru sayısı"
          >
            <strong>Soru Sayısı:</strong> {selectedBooklets.teo.question_count}
          </div>
        )}
      </section>

      {/* Uygulamalı Alanlar */}
      <section className="mb-5 p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-3 text-primary fw-bold">Uygulamalı Sınav Bilgileri</h5>

        <div className="row g-3 align-items-center mb-4">
          <label
            htmlFor="sure_img"
            className="col-sm-4 col-form-label fw-semibold"
          >
            Uygulamalı Süre (sn)
          </label>
          <div className="col-sm-8">
            <select
              id="sure_img"
              name="sure_img"
              value={formData.sure_img}
              onChange={handleChange}
              className="form-select shadow-sm"
            >
              {[...Array(11).keys()]
                .map((i) => 5 + i)
                .concat([...Array(17).keys()].map((i) => 20 + i * 5))
                .map((value) => (
                  <option key={value} value={value}>
                    {value} sn
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-center mb-4">
          <label
            htmlFor="passing_score_img"
            className="col-sm-4 col-form-label fw-semibold"
          >
            Geçme Notu
          </label>
          <div className="col-sm-8">
            <select
              id="passing_score_img"
              name="passing_score_img"
              value={formData.passing_score_img}
              onChange={handleChange}
              className="form-select shadow-sm"
            >
              {[...Array(11).keys()]
                .map((i) => 50 + i * 5)
                .map((value) => (
                  <option key={value} value={value}>
                    {value}%
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="bookletId_img" className="form-label fw-semibold">
            Kitapçık Seçiniz
          </label>
          <select
            id="bookletId_img"
            name="bookletId_img"
            value={formData.bookletId_img}
            onChange={handleChange}
            className="form-select shadow-sm"
          >
            <option value="">Seçiniz...</option>
            {booklets.img.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {selectedBooklets.img && (
          <div
            className="alert alert-info py-2 mt-2"
            role="alert"
            aria-label="Uygulamalı kitapçık soru sayısı"
          >
            <strong>Soru Sayısı:</strong> {selectedBooklets.img.question_count}
          </div>
        )}
      </section>

      {/* Ortak Diğer Alan */}
      <div className="mb-5">
        <label htmlFor="method" className="form-label fw-semibold">
          Sınav Metodu
        </label>
        <select
          id="method"
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="form-select shadow-sm"
        >
          <option value="random">Rastgele</option>
          <option value="sequential">Sıralı</option>
        </select>
      </div>

      {/* Seçilen Kitapçıklar */}
      <section className="p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-3 fw-bold">Seçilen Kitapçıklar</h5>

        <div className="mb-3">
          <strong>Teorik Sınav:</strong>
          <div className="ms-3">
            {selectedBooklets.teo ? (
              <>
                <p className="mb-1">
                  <span className="fw-semibold">Kitapçık Adı:</span>{" "}
                  {selectedBooklets.teo.name}
                </p>
                <p className="mb-1">
                  <span className="fw-semibold">Soru Sayısı:</span>{" "}
                  {selectedBooklets.teo.question_count}
                </p>
                <p className="mb-0">
                  <span className="fw-semibold">ID:</span>{" "}
                  {selectedBooklets.teo.id}
                </p>
              </>
            ) : (
              <p className="text-muted">Henüz seçilmedi</p>
            )}
          </div>
        </div>

        <div>
          <strong>Uygulamalı Sınav:</strong>
          <div className="ms-3">
            {selectedBooklets.img ? (
              <>
                <p className="mb-1">
                  <span className="fw-semibold">Kitapçık Adı:</span>{" "}
                  {selectedBooklets.img.name}
                </p>
                <p className="mb-1">
                  <span className="fw-semibold">Soru Sayısı:</span>{" "}
                  {selectedBooklets.img.question_count}
                </p>
                <p className="mb-0">
                  <span className="fw-semibold">ID:</span>{" "}
                  {selectedBooklets.img.id}
                </p>
              </>
            ) : (
              <p className="text-muted">Henüz seçilmedi</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
