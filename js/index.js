new Vue({
  data: {
    movies: [],
    date: "",
  },

  methods: {
    // 삭제 버튼
    doRemove: function (index) {
      // 전달받은 인덱스 위치에서 한 개만큼 제거하기
      this.movies.splice(index, 1);
    },
    searchBtnClicked: function () {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = ("0" + (1 + myDate.getMonth())).slice(-2);
      var day = myDate.getDate() - 1;
      let today = year + month + day;

      let key = "일별 BoxOffice 검색 키";
      let url =
        "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
      // search Axios
      axios({
        url,
        method: "GET",
        params: {
          key,
          targetDt:
            // 검색창에 입력 없으면 어제 날짜, 날짜 지정하면 지정한 날짜 검색
            this.date.replace(/-/g, "") == ""
              ? today
              : this.date.replace(/-/g, ""),
        },
      })
        .then((result) => {
          const REST_API_KEY = "카카오 키";
          let searchResult = result.data.boxOfficeResult.dailyBoxOfficeList;
          let movies = [];
          searchResult.forEach((e) => {
            let movie = {
              rank: e.rank,
              poster: "",
              movieNm: e.movieNm,
              audiCnt: e.audiCnt,
              openDt: e.openDt,
            };
            axios({
              async: true,
              headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`,
              },
              url: "https://dapi.kakao.com/v2/search/image",
              type: "GET",
              params: {
                query: e.movieNm + " 포스터",
              },
              dataType: "json",
            })
              .then(function (data) {
                console.log("이미지 성공");
                movie.poster = data.data.documents[0].thumbnail_url;
                // push
              })
              .catch(function (error) {
                console.log("이미지 실패!");
                console.log(error);
              });
            movies.push(movie);
          });
          this.movies = movies;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
}).$mount("#app");

// 카카오 이미지 요청 api 코드
// axios({
//               async: true,
//               headers: {
//                 Authorization: `KakaoAK de9356bc2123a980ffee4edc925200a6`,
//               },
//               url: "https://dapi.kakao.com/v2/search/image",
//               type: "GET",
//               params: {
//                 query: searchResult[i].movieNm + " 포스터",
//               },
//               dataType: "json",
//             })
//               .then(function (data) {
//                 console.log("이미지 성공");
//                 // console.log(data.data.documents[0]);
//                 // console.log(data.data.documents[1].doc_url);
//                 posterURL = data.data.documents[1].doc_url;
//                 // push
//               })
//               .catch(function (error) {
//                 console.log("이미지 실패!");
//                 console.log(error);
//               })
